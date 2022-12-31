const models = require("../models");
const { sequelize } = require("../models");
const { Op, where } = require("sequelize");
const mailer = require("../helper/mail.helper");

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
      designation_id: user.Designation[0].dataValues.id,
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
    return workspace;
  } catch (error) {
    await trans.rollback();
    console.log(error.message);
    return { data: null, error: error };
  }
};

const addUserInWorkspace = async (payload) => {
  const workspace = await models.Workspace.findOne({
    where: { id: payload.workspaceId },
  });

  if (!workspace) {
    throw new Error("Workspace Not Found");
  }

  const user = await models.User.findOne({
    where: { id: payload.userId },
  });
  if (!user) {
    throw new Error("User Not Found");
  }
  const existingRelation = await models.UserWorkspaceMapping.findOne({
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
    designation_id: payload.designationId,
  };
  await models.UserWorkspaceMapping.create(userWorkspaceData);
  const body = `you are added into  ${workspace.name}  workspace`;
  const subject = "workspace";
  const recipient = user.email;
  mailer.sendMail(body, subject, recipient);
  return payload;
};

const getAllWorkSpace = async (query) => {
  let limit = query.page == 0 ? null : query.limit;
  let page = query.page < 2 ? 0 : query.page;

  const workspace = await models.UserWorkspaceMapping.findAll({
    attributes: {
      exclude: [
        "created_at",
        "user_id",
        "designation_id",
        "updated_at",
        "deleted_at",
      ],
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
    limit: limit,
    offset: page * 3,
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

  const workspace = await models.Workspace.update(payload, {
    where: { id: paramsData.workspaceId },
  });
  return "workspace description updated successfully";
};

const updateUserDesignationInWorkspace = async (payload, user, paramsData) => {
  const checkWorkspace = await models.Workspace.findOne({
    where: { id: paramsData.workspaceId },
  });

  if (!checkWorkspace) {
    throw new Error("Workspace not found");
  }
  const userInWorkspace = await models.UserWorkspaceMapping.findOne({
    where: {
      [Op.and]: [
        { user_id: payload.userId },
        { workspace_id: paramsData.workspaceId },
      ],
    },
  });

  if (!userInWorkspace) {
    throw new Error("User does not exist in workspace ");
  }
  const checkUser = await models.User.findOne({
    where: { id: payload.userId },
  });

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
  const body = `your designation has been updated into  ${checkWorkspace.name}  workspace`;
  const subject = "update designation";
  const recipient = checkUser.email;
  mailer.sendMail(body, subject, recipient);

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

const removeUserWorkspace = async (payload, paramsData) => {
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
      ],
    },
  });

  if (!existingRelation) {
    throw new Error("User is not exist in workspace");
  }
  await models.UserWorkspaceMapping.destroy({
    where: {
      [Op.and]: [
        { user_id: payload.userId },
        { workspace_id: paramsData.workspaceId },
      ],
    },
  });
  const user = await models.User.findOne({
    id: payload.userId,
  });

  const body = `you are remove from  ${workspace.name}  workspace`;
  const subject = "workspace";
  const recipient = user.email;
  mailer.sendMail(body, subject, recipient);
  return "User remove successfully";
};

module.exports = {
  createWorkspace,
  addUserInWorkspace,
  getAllWorkSpace,
  updateWorkspace,
  updateUserDesignationInWorkspace,
  deactivateWorkspace,
  removeUserWorkspace,
};
