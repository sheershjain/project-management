const models = require("../models");
const { sequelize } = require("../models");
const { Op, where } = require("sequelize");

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

  let existingRelation = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { user_id: payload.userId },
        { workspace_id: payload.workspaceId },
      ],
    },
  });

  if (existingRelation) {
    throw new Error("User is already exist in workspace ");
  }

  let userWorkspaceData = {
    user_id: payload.userId,
    workspace_id: payload.workspaceId,
    designation_id: "98ee802b-bbbb-49f4-b2ff-7695a480513b",
  };
  await models.UserWorkspaceMapping.create(userWorkspaceData);
  return payload;
};

const getAllWorkSpace = async (query) => {
  let limit = query.page == 0 ? null : query.limit;
  let page = query.page < 2 ? 0 : query.page;

  const workspace = await models.Workspace.findAll({
    attributes: {
      exclude: ["created_at", "updated_at", "deleted_at"],
    },
    include: [
      {
        model: models.Designation,
        as: "Designation",
        attributes: ["designationTitle"],
      },
      {
        model: models.User,
        as: "User",
        attributes: ["email"],
      },
    ],
    // limit: limit,
    // offset: page * 3,
  });
  return workspace;
};

const updateWorkspace = async (payload, user, paramsData) => {
  const checkWorkspace = await models.Workspace.findOne({
    where: { id: paramsData.workspaceId },
  });

  if (!checkWorkspace) {
    throw new Error("Workspace not found");
  }

  let existingManager = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { user_id: user.id },
        { workspace_id: paramsData.workspaceId },
      ],
    },
  });

  if (!existingManager) {
    throw new Error("Access denied");
  }

  const workspace = await models.Workspace.update(
    {
      description: payload.description,
    },
    { where: { id: paramsData.workspaceId } }
  );
  return "workspace description updated successfully";
};

const updateUserDesignationInWorkspace = async (payload, user, paramsData) => {
  const checkUser = await models.User.findOne({
    where: { id: payload.userId },
  });

  if (!checkUser) {
    throw new Error("User not found");
  }

  const checkWorkspace = await models.Workspace.findOne({
    where: { id: paramsData.workspaceId },
  });

  if (!checkWorkspace) {
    throw new Error("Workspace not found");
  }

  let existingRelation = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { user_id: payload.userId },
        { workspace_id: paramsData.workspaceId },
        { designation_id: payload.designationId },
      ],
    },
  });

  if (existingRelation) {
    throw new Error("This relation is already exist in workspace ");
  }
  await models.UserWorkspaceMapping.update(
    {
      designation_id: payload.designationId,
    },
    {
      where: {
        [Op.and]: [
          { user_id: payload.userId },
          { workspace_id: paramsData.workspaceId },
        ],
      },
    }
  );

  return payload;
};

const deactivateWorkspace = async (user, paramsData) => {
  const checkWorkspace = await models.Workspace.findOne({
    where: { id: paramsData.workspaceId },
  });

  if (!checkWorkspace) {
    throw new Error("Workspace not found");
  }
  let existingManager = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { user_id: user.id },
        { workspace_id: paramsData.workspaceId },
      ],
    },
  });

  if (!existingManager) {
    throw new Error("Access denied");
  }
  await models.Workspace.destroy({
    where: {
      id: paramsData.workspaceId,
    },
  });
  return "workspace deactivate successfully";
};

module.exports = {
  createWorkspace,
  addUserInWorkspace,
  getAllWorkSpace,
  updateWorkspace,
  updateUserDesignationInWorkspace,
  deactivateWorkspace,
};
