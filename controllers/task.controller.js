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
    const { params } = req;
    const paramsData = {
      taskId: params.taskId,
    };
    const { body: payload, user } = req;
    const data = await taskService.updateTask(payload, user, paramsData);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { params } = req;
    const paramsData = {
      taskId: params.taskId,
    };
    const { user } = req;
    const data = await taskService.deleteTask(user, paramsData);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const myTask = async (req, res, next) => {
  try {
    const { user } = req;
    const data = await taskService.myTask(user);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  myTask,
};
