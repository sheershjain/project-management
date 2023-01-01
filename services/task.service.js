const models = require("../models");
const { sequelize } = require("../models");
const { Op, where } = require("sequelize");
const mailer = require("../helper/mail.helper");
const moment = require("moment");
const user = require("../models/user");

const sprint = async (sprintId) => {
  const sprint = await models.Sprint.findOne({
    where: { id: sprintId },
  });
  return sprint;
};

const userInWorkspaceMapping = async (userId, workspaceId) => {
  const userWorkspaceMapping = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [{ user_id: userId }, { workspace_id: workspaceId }],
    },
  });
  return userWorkspaceMapping;
};

const createTask = async (payload, user) => {
  const sprintId = payload.sprintId;
  const checkSprint = await sprint(sprintId);
  if (!checkSprint) {
    throw new Error("Sprint not found");
  }

  const checkUser = await models.User.findOne({
    where: { id: payload.userId },
  });

  const loginUser = user.id;
  const workspaceId = checkSprint.workspace_id;

  const taskCreator = await userInWorkspaceMapping(loginUser, workspaceId);
  if (!taskCreator) {
    throw new Error("Access denied");
  }

  const assignTo = payload.userId;
  const taskToUser = await userInWorkspaceMapping(assignTo, workspaceId);
  if (!taskToUser) {
    throw new Error("User does not exist in workspace ");
  }

  const currentTimeDateTime = moment().format("YYYY-MM-DD HH:mm:s");
  const deadline = payload.deadline;
  if (deadline <= currentTimeDateTime) {
    throw new Error("Invalid deadline");
  }
  payload.watch = [user.email];
  payload.status = "pending";
  const task = await models.Task.create(payload);

  const body = `You have assign task -  ${task.dataValues.task}`;
  const subject = "Your workspace Task";
  const recipient = checkUser.email;
  mailer.sendMail(body, subject, recipient);
  return task;
};

const updateTask = async (payload, user, paramsData) => {
  const checkTask = await models.Task.findOne({
    where: { id: paramsData.taskId },
  });

  if (!checkTask) {
    throw new Error("Task not found");
  }

  const checkUser = await models.User.findOne({
    where: { id: checkTask.userId },
  });

  const sprintId = checkTask.sprintId;
  const checkSprint = await sprint(sprintId);

  const currentTimeDateTime = moment().format("YYYY-MM-DD HH:mm:s");
  const deadline = payload.deadline;
  if (deadline <= currentTimeDateTime) {
    throw new Error("Invalid deadline");
  }
  const loginUser = user.id;
  const workspaceId = checkSprint.workspace_id;

  const taskUpdatedBy = await userInWorkspaceMapping(loginUser, workspaceId);
  if (!taskUpdatedBy) {
    throw new Error("Access denied");
  }

  await models.Task.update(payload, {
    where: { id: paramsData.taskId },
  });

  const body = `Your task has been updated by -  ${user.email}`;
  const subject = "Task Updated";
  const recipient = checkUser.email;
  mailer.sendMail(body, subject, recipient);
  return "task updated successfully";
};

const deleteTask = async (user, paramsData) => {
  const checkTask = await models.Task.findOne({
    where: { id: paramsData.taskId },
  });

  if (!checkTask) {
    throw new Error("Task not found");
  }

  const checkUser = await models.User.findOne({
    where: { id: checkTask.userId },
  });

  const sprintId = checkTask.sprintId;
  const checkSprint = await sprint(sprintId);

  const loginUser = user.id;
  const workspaceId = checkSprint.workspace_id;

  const taskDeletedBy = await userInWorkspaceMapping(loginUser, workspaceId);
  if (!taskDeletedBy) {
    throw new Error("Access denied");
  }

  await models.Task.destroy({
    where: { id: paramsData.taskId },
  });

  const body = `Your task has been deleted by -  ${user.email}`;
  const subject = "Task Deleted";
  const recipient = checkUser.email;
  mailer.sendMail(body, subject, recipient);
  return "task deleted successfully";
};

const myTask = async (user) => {
  const task = await models.Task.findAll({
    where: { userId: user.id },
  });
  return task;
};

const watch = async (user, paramsData) => {
  const task = await models.Task.findOne({
    where: { id: paramsData.taskId },
  });
  if (!task) {
    throw new Error("Task not found");
  }
  task.watch.push(user.email);
  const watchedBy = task.watch;
  await models.Task.update(
    {
      watch: watchedBy,
    },
    { where: { id: paramsData.taskId } }
  );
  return "you are added into task";
};

const addTaskComment = async (payload, user) => {
  const task = await models.Task.findOne({
    where: {
      [Op.and]: [{ id: payload.taskId }, { userId: user.id }],
    },
  });
  if (!task) {
    throw new Error("Task not found");
  }
  const taskComment = await models.TaskComment.create(payload);
  return taskComment;
};

const taskStatus = async (payload, user, paramsData) => {
  const task = await models.Task.findOne({
    where: {
      [Op.and]: [{ id: paramsData.taskId }, { userId: user.id }],
    },
  });
  if (!task) {
    throw new Error("Task not found");
  }
  const leadDesignation = await models.Designation.findOne({
    where: { designationCode: 103 },
  });
  const sprintId = task.sprintId;
  const checkSprint = await sprint(sprintId);
  const workspaceLead = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { workspace_id: checkSprint.workspaceId },
        { designation_id: leadDesignation.id },
      ],
    },
  });
  const leadInfo = await models.User.findOne({
    where: { id: workspaceLead.user_id },
  });

  const status = await models.Task.update(payload, {
    where: { id: paramsData.taskId },
  });
  if (payload.status == "done") {
    const body = `Please approve this task -  ${paramsData.taskId}`;
    const subject = "Approve Task ";
    const recipient = leadInfo.email;
    mailer.sendMail(body, subject, recipient);
  }

  return "status updated successfully";
};

const approveTask = async (user, paramsData) => {
  const task = await models.Task.findOne({
    where: {
      id: paramsData.taskId,
    },
  });
  const checkUser = await models.User.findOne({
    where: { id: task.userId },
  });

  const leadDesignation = await models.Designation.findOne({
    where: { designationCode: 103 },
  });
  const sprintId = task.sprintId;
  const checkSprint = await sprint(sprintId);
  const workspaceLead = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { user_id: user.id },
        { workspace_id: checkSprint.workspaceId },
        { designation_id: leadDesignation.id },
      ],
    },
  });
  if (!workspaceLead) {
    throw new Error("Access denied");
  }

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.status == "approved") {
    throw new Error("Task is already approved");
  }

  const status = await models.Task.update(
    {
      status: "approved",
    },
    { where: { id: paramsData.taskId } }
  );
  const body = `Your Task is approved -  ${paramsData.taskId}`;
  const subject = "Approve Task ";
  const recipient = checkUser.email;
  mailer.sendMail(body, subject, recipient);
  return "Task approved";
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  myTask,
  watch,
  addTaskComment,
  taskStatus,
  approveTask,
};
