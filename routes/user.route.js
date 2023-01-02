const { Router } = require("express");
const userController = require("../controllers/user.controller");
const {
  checkAccessToken,
  checkRefreshToken,
} = require("../middlewares/auth.middleware");
const genericResponse = require("../helper/generic-response.helper");
const validator = require("../validators");
const router = Router();

router.post(
  "/login",
  validator.userValidator.loginSchema,
  userController.loginUser,
  genericResponse.sendResponse
);

router.patch(
  "/reset-password",
  checkAccessToken,
  validator.userValidator.resetPassword,
  userController.resetPassword,
  genericResponse.sendResponse
);

router.patch(
  "/forget-password",
  validator.userValidator.forgetPassword,
  userController.forgetPassword,
  genericResponse.sendResponse
);

router.patch(
  "/reset-password/:token",
  validator.userValidator.resetPasswordByLink,
  userController.resetPasswordByLink,
  genericResponse.sendResponse
);
router.get(
  "/refresh-token",
  checkRefreshToken,
  userController.refreshToken,
  genericResponse.sendResponse
);

module.exports = router;
