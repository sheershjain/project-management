const models = require("../models");
const { sequelize } = require("../models");
const { Op, where } = require("sequelize");
const moment = require("moment");

const createSprint = async (payload, user) => {
  const checkWorkspace = await models.Workspace.findOne({
    where: { id: payload.workspaceId },
  });
  if (!checkWorkspace) {
    throw new Error("Workspace not found");
  }
  let currentDateTime = moment().format();
  let deadline = payload.deadline;
  if (deadline <= currentDateTime) {
    throw new Error("Invalid deadline");
  }
  let isLeadWorkspace = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { user_id: user.id },
        { workspace_id: payload.workspaceId },
        { designation_id: "a1cb978e-48cf-47d6-9837-b26279f27fa7" },
      ],
    },
  });
  if (!isLeadWorkspace) {
    throw new Error("Access denied");
  }
  await models.Sprint.create(payload);

  return "sprint created successfully";
};

module.exports = {
  createSprint,
};
