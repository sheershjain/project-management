const { Router } = require("express");
const userController = require("../controllers/user.controller");
const {
  checkAccessToken,
  checkRefreshToken,
} = require("../middlewares/auth.middleware");
const genericResponse = require("../helper/generic-response.helper");
const userValidator = require("../validators/user.validator");
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
  userValidator.resetPassword,
  userController.resetPassword,
  genericResponse.sendResponse
);

router.patch(
  "/forget-password",
  userValidator.forgetPassword,
  userController.forgetPassword,
  genericResponse.sendResponse
);

router.patch(
  "/reset-password/:token",
  userValidator.resetPasswordByLink,
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
