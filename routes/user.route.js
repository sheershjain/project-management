const { Router } = require("express");
const controllers = require("../controllers");
const {
  checkAccessToken,
  checkRefreshToken,
  verifyManager,
} = require("../middlewares/auth.middleware");
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
router.get(
  "/refresh-token",
  checkRefreshToken,
  controllers.User.refreshToken,
  genericResponse.sendResponse
);

router.post(
  "/user-workspace",
  checkAccessToken,
  verifyManager,
  validator.workspaceValidator.addUserWorkspaceSchema,
  controllers.Workspace.addUserInWorkspace,
  genericResponse.sendResponse
);

router.post(
  "/workspace",
  checkAccessToken,
  verifyManager,
  validator.workspaceValidator.workspaceSchema,
  controllers.Workspace.createWorkspace,
  genericResponse.sendResponse
);

router.patch(
  "/workspace/:workspaceId",
  checkAccessToken,
  verifyManager,
  validator.workspaceValidator.updateWorkspaceSchema,
  controllers.Workspace.updateWorkspace,
  genericResponse.sendResponse
);

router.patch(
  "/user-workspace/:workspaceId",
  checkAccessToken,
  verifyManager,
  validator.workspaceValidator.updateDesignationWorkspaceSchema,
  controllers.Workspace.updateUserDesignationInWorkspace,
  genericResponse.sendResponse
);

router.delete(
  "/workspace/:workspaceId",
  checkAccessToken,
  verifyManager,
  controllers.Workspace.deactivateWorkspace,
  genericResponse.sendResponse
);

router.delete(
  "/user-workspace/:workspaceId",
  checkAccessToken,
  verifyManager,
  validator.workspaceValidator.removeUserWorkspaceSchema,
  controllers.Workspace.removeUserWorkspace,
  genericResponse.sendResponse
);

module.exports = router;
