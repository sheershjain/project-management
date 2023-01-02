const { Router } = require("express");
const userController = require("../controllers/user.controller");
const {
  checkAccessToken,
  checkRefreshToken,
  verifyManager,
} = require("../middlewares/auth.middleware");
const genericResponse = require("../helpers/generic-response.helper");
const userValidator = require("../validators/user.validator");
const router = Router();

router.post(
  "/login",
  userValidator.loginSchema,
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
router.post(
  "/logout",
  checkAccessToken,
  userController.logOutUser,
  genericResponse.sendResponse
);

router.post(
  "/user-workspace",
  checkAccessToken,
  verifyManager,
  validator.workspaceValidator.addUserWorkspaceSchema,
  controllers.Workspace.addUserInWorkspace,
  serializer.workspaceSerializer.addUserInWorkspace,
  genericResponse.sendResponse
);

router.post(
  "/workspace",
  checkAccessToken,
  verifyManager,
  validator.workspaceValidator.workspaceSchema,
  controllers.Workspace.createWorkspace,
  serializer.workspaceSerializer.createWorkspace,
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
  "/archive/:workspaceId",
  checkAccessToken,
  verifyManager,
  controllers.Workspace.archiveWorkspace,
  genericResponse.sendResponse
);

router.delete(
  "/user-workspace",
  checkAccessToken,
  verifyManager,
  controllers.Workspace.removeUserWorkspace,
  genericResponse.sendResponse
);

router.get(
  "/workspace",
  checkAccessToken,
  controllers.Workspace.myWorkspace,
  serializer.workspaceSerializer.getAllWorkspace,
  genericResponse.sendResponse
);

router.patch(
  "/open/:workspaceId",
  checkAccessToken,
  verifyManager,
  controllers.Workspace.openWorkspace,
  genericResponse.sendResponse
);

module.exports = router;
