const { commonErrorHandler } = require("../helper/error-handler.helper");
const WorkspaceService = require("../services/workspace.service");

const createWorkspace = async (req, res, next) => {
  try {
    const { body: payload, user } = req;
    const response = await WorkspaceService.createWorkspace(payload, user);
    if (response.error) {
      throw new Error(response.error.message);
    }
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  createWorkspace,
};
