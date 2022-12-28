const { commonErrorHandler } = require("../helper/error-handler.helper");
const userService = require("../services/user.service");

const createUser = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await userService.createUser(payload);
    if (response.error) {
      throw new Error(response.error.message);
    }
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const data = await userService.loginUser(payload);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const { query } = req;
    const data = await userService.getAllUser(query);
    res.data = data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUser,
};
