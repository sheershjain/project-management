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
    where: {
      [Op.and]: [{ designationCode: 103 }, { designationCode: 102 }],
    },
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
    where: {
      [Op.and]: [{ designationCode: 103 }, { designationCode: 102 }],
    },
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
    where: {
      [Op.and]: [{ designationCode: 103 }, { designationCode: 102 }],
    },
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
    if (!task) {
      throw new Error("something went wrong");
    }
    const sprint = await models.Sprint.destroy(
      {
        where: { id: paramsData.sprintId },
      },
      { transaction: trans }
    );
    if (!sprint) {
      throw new Error("something went wrong");
    }
    await trans.commit();
    return "sprint archive successfully";
  } catch (error) {
    await trans.rollback();
    console.log(error.message);
    return { data: null, error: error.message };
  }
};

const mySprint = async (user, paramsData) => {
  const checkWorkspace = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [{ userId: user.id }, { workspaceId: paramsData.workspaceId }],
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
    if (!sprint) {
      throw new Error("sprint not found");
    }
    const checkSprint = await models.Sprint.findOne(
      {
        where: { id: paramsData.sprintId },
      },
      { transaction: trans }
    );
    if (!checkSprint) {
      throw new Error("sprint not found");
    }
    const designation = await models.Designation.findOne(
      {
        where: {
          [Op.and]: [
            { designationCode: 103 },
            { designationCode: 102 },
          ],
        },
      },
      { transaction: trans }
    );
    if (!designation) {
      throw new Error("designation not found");
    }
    const isLeadWorkspace = await models.UserWorkspaceMapping.findOne(
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

    const findWorkspace = await models.Workspace.findOne(
      {
        where: { id: isLeadWorkspace.workspaceId },
      },
      { transaction: trans }
    );
    if (!findWorkspace) {
      throw new Error("something went wrong");
    }
    await trans.commit();
    return "sprint opened successfully";
  } catch (error) {
    await trans.rollback();
    console.log(error.message);
    return { data: null, error: error.message };
  }
};

const openAllSprint = async (user, paramsData) => {
  const findWorkspace = await models.Workspace.findOne({
    where: { id: paramsData.workspaceId },
  });
  if (!findWorkspace) {
    throw new Error("Workspace not found");
  }
  const trans = await sequelize.transaction();
  try {
    const sprint = await models.Sprint.restore(
      {
        where: { workspaceId: paramsData.workspaceId },
      },
      { transaction: trans }
    );
    if (!sprint) {
      throw new Error("something went wrong");
    }
    const checkSprint = await models.Sprint.findAll(
      {
        where: { workspaceId: paramsData.workspaceId },
      },
      { transaction: trans }
    );
    if (!checkSprint) {
      throw new Error("something went wrong");
    }
    for (let sprint = 0; sprint < checkSprint.length; sprint++) {
      const task = await models.Task.restore(
        {
          where: { sprintId: checkSprint[sprint].id },
        },
        { transaction: trans }
      );
      if (!task) {
        throw new Error("something went wrong");
      }
    }
    const designation = await models.Designation.findOne(
      {
        where: {
          [Op.and]: [{ designationCode: 103 }, { designationCode: 102 }],
        },
      },
      { transaction: trans }
    );
    if (!designation) {
      throw new Error("something went wrong");
    }
    let isLeadWorkspace = await models.UserWorkspaceMapping.findOne(
      {
        where: {
          [Op.and]: [
            { userId: user.id },
            { workspaceId: paramsData.workspaceId },
            { designationId: designation.id },
          ],
        },
      },
      { transaction: trans }
    );

    if (!isLeadWorkspace) {
      throw new Error("something went wrong");
    }

    await trans.commit();
    return "All sprint opened successfully";
  } catch (error) {
    await trans.rollback();
    console.log(error.message);
    return { data: null, error: error.message };
  }
};
module.exports = {
  createSprint,
  updateSprint,
  archiveSprint,
  mySprint,
  openSprint,
  openAllSprint,
};
