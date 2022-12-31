const models = require("../models");
const { sequelize } = require("../models");
const { Op, where } = require("sequelize");
const mailer = require("../helper/mail.helper");
const moment = require("moment");

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
  const currentTimeDateTime = moment().format("YYYY-MM-DD HH:mm:s");
  const deadline = payload.deadline;
  if (deadline <= currentTimeDateTime) {
    throw new Error("Invalid deadline");
  }
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
  console.log("-------------------->>>>>>");
  const task = await models.Task.findAll({
    where: { userId: user.id },
  });
  return task;
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  myTask,
};
