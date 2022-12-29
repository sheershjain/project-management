const models = require("../models");
const { sequelize } = require("../models");
const { Op } = require("sequelize");

const createWorkspace = async (payload, user) => {
  const trans = await sequelize.transaction();
  try {
    const workspace = await models.Workspace.create(payload, {
      transaction: trans,
    });

    if (!workspace) {
      throw new Error("Something went wrong");
    }
    const userId = user.id;
    const workspaceId = workspace.dataValues.id;

    const workspaceData = {
      user_id: userId,
      workspace_id: workspaceId,
      designation_id: "c68d5252-ebc5-4a2b-a452-37c00cd55a1c",
    };

    const userWorkspaceMapping = await models.UserWorkspaceMapping.create(
      workspaceData,
      {
        transaction: trans,
      }
    );
    if (!userWorkspaceMapping) {
      throw new Error("Something went wrong");
    }
    await trans.commit();
    return "workspace created";
  } catch (error) {
    await trans.rollback();
    console.log(error.message);
    return { data: null, error: error };
  }
};

const addUserInWorkspace = async (payload) => {
  const user = await models.User.findOne({
    id: payload.userId,
  });

  if (!user) {
    throw new Error("User Not Found");
  }

  const workspace = await models.Workspace.findOne({
    id: payload.workspaceId,
  });

  if (!workspace) {
    throw new Error("Workspace Not Found");
  }

  const designation = await models.Designation.findOne({
    id: payload.designationId,
  });

  if (!designation) {
    throw new Error("Designation Not Found");
  }

  let existingRelation = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { user_id: payload.userId },
        { designation_id: payload.designationId },
      ],
    },
  });

  if (existingRelation) {
    throw new Error("User is already exist in workspace ");
  }

  let userWorkspaceData = {
    user_id: payload.userId,
    workspace_id: payload.workspaceId,
    designation_id: payload.designationId,
  };
  await models.UserWorkspaceMapping.create(userWorkspaceData);
  return payload;
};

module.exports = {
  createWorkspace,
  addUserInWorkspace,
};
