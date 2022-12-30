const models = require("../models");
const { sequelize } = require("../models");
const { Op, where } = require("sequelize");
const { sendMail } = require("../helper/send-mail.helper");
const mailer = require("../helper/send-mail.helper");
const moment = require("moment");

const sprint = async (sprintId) => {
  const sprint = await models.Sprint.findOne({
    where: { id: sprintId },
  });
  return sprint;
};

const userInWorkspace = async (userId, workspaceId) => {
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

  const existingRelation = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { user_id: payload.userId },
        { workspace_id: checkSprint.workspace_id },
      ],
    },
  });

  if (!existingRelation || !userInWorkspace) {
    throw new Error("User does not exist in workspace ");
  }
  payload.watch = [user.email];
  payload.status = "pending";
  const task = await models.Task.create(payload);

  const body = `You have assign task -  ${task.dataValues.task}`;
  const subject = "Your workspace Task";
  const recipient = checkUser.email;
  mailer.sendMail(body, subject, recipient);
  return "assign task successfully";
};

const updateTask = async (payload, user) => {
  const checkTask = await models.Task.findOne({
    where: { id: payload.taskId },
  });

  if (!checkTask) {
    throw new Error("Task not found");
  }
  const userInWorkspace = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { user_id: user.id },
        { workspace_id: checkSprint.workspace_id },
      ],
    },
  });

  if (!userInWorkspace) {
    throw new Error("User does not exist in workspace ");
  }
  const findUser = await models.User.findOne({
    where: { id: checkTask.userId },
  });
  await models.Task.update(payload, {
    where: { id: taskId },
  });

  const body = `Your task has been updated by -  ${findUser.email}`;
  const subject = "Your workspace Task";
  const recipient = checkUser.email;
  mailer.sendMail(body, subject, recipient);
  return payload;
};

module.exports = {
  createTask,
  updateTask,
};
