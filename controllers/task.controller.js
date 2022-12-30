const { commonErrorHandler } = require("../helper/error-handler.helper");
const taskService = require("../services/task.service");

const createTask = async (req, res, next) => {
  try {
    const { body: payload, user } = req;
    const data = await taskService.createTask(payload, user);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { body: payload, user } = req;
    const data = await taskService.updateTask(payload, user);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  createTask,
  updateTask,
};
