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
  const designation = await models.Designation.findOne({
    where: { designationCode: 103 },
  });
  const isLeadWorkspace = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { userId: user.id },
        { workspaceId: payload.workspaceId },
        { designationId: designation.id },
      ],
    },
  });
  if (!isLeadWorkspace) {
    throw new Error("Access denied");
  }

  const currentTimeDateTime = moment().format("YYYY-MM-DD HH:mm:s");
  const deadline = payload.deadline;
  if (deadline <= currentTimeDateTime) {
    throw new Error("Invalid deadline");
  }

  const sprint = await models.Sprint.create(payload);
  return sprint;
};

const updateSprint = async (payload, user, paramsData) => {
  const checkSprint = await models.Sprint.findOne({
    where: { id: paramsData.sprintId },
  });
  if (!checkSprint) {
    throw new Error("Sprint not found");
  }
  const designation = await models.Designation.findOne({
    where: { designationCode: 103 },
  });
  let isLeadWorkspace = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { userId: user.id },
        { workspaceId: checkSprint.dataValues.workspaceId },
        { designationId: designation.id },
      ],
    },
  });
  if (!isLeadWorkspace) {
    throw new Error("Access denied");
  }

  const sprint = await models.Sprint.update(payload, {
    where: { id: paramsData.sprintId },
  });

  return "sprint updated successfully";
};

const archiveSprint = async (user, paramsData) => {
  const checkSprint = await models.Sprint.findOne({
    where: { id: paramsData.sprintId },
  });
  if (!checkSprint) {
    throw new Error("Sprint not found");
  }
  const designation = await models.Designation.findOne({
    where: { designationCode: 103 },
  });
  let isLeadWorkspace = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { userId: user.id },
        { workspaceId: checkSprint.dataValues.workspaceId },
        { designationId: designation.id },
      ],
    },
  });

  if (!isLeadWorkspace) {
    throw new Error("Access denied");
  }
  const trans = await sequelize.transaction();
  try {
    const task = await models.Task.destroy(
      {
        where: { sprintId: paramsData.sprintId },
      },
      { transaction: trans }
    );

    const sprint = await models.Sprint.destroy(
      {
        where: { id: paramsData.sprintId },
      },
      { transaction: trans }
    );

    await trans.commit();
    return "sprint deleted successfully";
  } catch (error) {
    await trans.rollback();
    console.log(error.message);
    return { data: null, error: error };
  }
};

const mySprint = async (user, paramsData) => {
  const checkWorkspace = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { userId: user.id },
        { workspaceId: paramsData.workspaceId },
      ],
    },
  });

  if (!checkWorkspace) {
    throw new Error("Workspace not found");
  }

  const sprint = await models.Sprint.findAll({
    where: { workspaceId: checkWorkspace.workspaceId },
  });
  return sprint;
};

const openSprint = async (user, paramsData) => {
  const trans = await sequelize.transaction();
  try {
    const sprint = await models.Sprint.restore(
      {
        where: { id: paramsData.sprintId },
      },
      { transaction: trans }
    );

    const checkSprint = await models.Sprint.findOne(
      {
        where: { id: paramsData.sprintId },
      },
      { transaction: trans }
    );
    const designation = await models.Designation.findOne(
      {
        where: { designationCode: 103 },
      },
      { transaction: trans }
    );
    let isLeadWorkspace = await models.UserWorkspaceMapping.findOne(
      {
        where: {
          [Op.and]: [
            { userId: user.id },
            { workspaceId: checkSprint.dataValues.workspaceId },
            { designationId: designation.id },
          ],
        },
      },
      { transaction: trans }
    );

    if (!isLeadWorkspace) {
      throw new Error("Access denied");
    }

    await trans.commit();
    return "sprint opened successfully";
  } catch (error) {
    await trans.rollback();
    console.log(error.message);
    return { data: null, error: error };
  }
};

module.exports = {
  createSprint,
  updateSprint,
  archiveSprint,
  mySprint,
  openSprint,
};
