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

const addUserInWorkspace = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await WorkspaceService.addUserInWorkspace(payload);
    if (response.error) {
      throw new Error(response.error.message);
    }
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const getAllWorkSpace = async (req, res, next) => {
  try {
    const { query } = req;
    const data = await WorkspaceService.getAllWorkSpace(query);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const updateWorkspace = async (req, res, next) => {
  try {
    const { params } = req;
    const { body: payload, user } = req;
    const paramsData = {
      workspaceId: params.workspaceId,
    };

    const data = await WorkspaceService.updateWorkspace(payload, user, paramsData);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  createWorkspace,
  addUserInWorkspace,
  getAllWorkSpace,
  updateWorkspace,
};
