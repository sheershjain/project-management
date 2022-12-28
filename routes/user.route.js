const { Router } = require("express");
const controllers = require("../controllers");
const { checkAccessToken } = require("../middlewares/auth");
const genericResponse = require("../helper/generic-response.helper");
const validator = require("../validators");
const router = Router();

router.post(
  "/login",
  validator.userValidator.loginSchema,
  controllers.User.loginUser,
  genericResponse.sendResponse
);

router.patch(
  "/reset-password",
  checkAccessToken,
  validator.userValidator.resetPassword,
  controllers.User.resetPassword,
  genericResponse.sendResponse
);

router.patch(
  "/forget-password",
  validator.userValidator.forgetPassword,
  controllers.User.forgetPassword,
  genericResponse.sendResponse
);

router.patch(
  "/reset-password/:token",
  validator.userValidator.resetPasswordByLink,
  controllers.User.resetPasswordByLink,
  genericResponse.sendResponse
);

module.exports = router;
