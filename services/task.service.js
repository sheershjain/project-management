const models = require("../models");
const { sequelize } = require("../models");
const { Op, where } = require("sequelize");
const { sendMail } = require("../helper/send-mail.helper");
const mailer = require("../helper/send-mail.helper");

const createTask = async (payload, user) => {
  const checkSprint = await models.Sprint.findOne({
    where: { id: payload.sprintId },
  });

  if (!checkSprint) {
    throw new Error("Sprint not found");
  }
  const checkUser = await models.User.findOne({
    where: { id: payload.userId },
  });
  if (!checkUser) {
    throw new Error("User Not Found");
  }
  const currentTimeDateTime = moment().format("YYYY-MM-DD HH:mm:s");
  const deadline = payload.deadline;
  if (deadline <= currentTimeDateTime) {
    throw new Error("Invalid deadline");
  }

  let existingRelation = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { user_id: payload.userId },
        { workspace_id: checkSprint.workspace_id },
      ],
    },
  });

  if (!existingRelation) {
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

module.exports = {
  createTask,
};
