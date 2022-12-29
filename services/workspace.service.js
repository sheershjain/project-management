const models = require("../models");
const { sequelize } = require("../models");

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

module.exports = {
  createWorkspace,
};
