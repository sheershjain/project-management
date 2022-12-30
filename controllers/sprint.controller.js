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

module.exports = {
  createSprint,
};
