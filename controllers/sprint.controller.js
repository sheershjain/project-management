const { commonErrorHandler } = require("../helper/error-handler.helper");
const sprintService = require("../services/sprint.service");

const createSprint = async (req, res, next) => {
  try {
    const { body: payload, user } = req;
    const data = await sprintService.createSprint(payload, user);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const updateSprint = async (req, res, next) => {
  try {
    const { params } = req;
    const paramsData = {
      sprintId: params.sprintId,
    };
    const { body: payload, user } = req;
    const data = await sprintService.updateSprint(payload, user, paramsData);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const deleteSprint = async (req, res, next) => {
  try {
    const { params } = req;
    const paramsData = {
      sprintId: params.sprintId,
    };
    const { user } = req;
    const data = await sprintService.deleteSprint(user, paramsData);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  createSprint,
  updateSprint,
  deleteSprint,
};
