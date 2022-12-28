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

module.exports = {
  createUser,
};
