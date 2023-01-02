const { Router } = require("express");
const userController = require("../controllers/user.controller");
const workspaceCotroller = require("../controllers/workspace.controller");
const {
  checkAccessToken,
  checkRefreshToken,
  verifyManager,
} = require("../middlewares/auth.middleware");
const genericResponse = require("../helpers/generic-response.helper");
const userValidator = require("../validators/user.validator");
const workspaceValidator = require("../validators/workspace.validator");
const workspaceSerializer = require("../serializers/workspace.serializer");
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
  workspaceValidator.addUserWorkspaceSchema,
  workspaceCotroller.addUserInWorkspace,
  workspaceSerializer.addUserInWorkspace,
  genericResponse.sendResponse
);

router.post(
  "/workspace",
  checkAccessToken,
  verifyManager,
  workspaceValidator.workspaceSchema,
  workspaceCotroller.createWorkspace,
  workspaceSerializer.createWorkspace,
  genericResponse.sendResponse
);

router.patch(
  "/workspace/:workspaceId",
  checkAccessToken,
  verifyManager,
  workspaceValidator.updateWorkspaceSchema,
  workspaceCotroller.updateWorkspace,
  genericResponse.sendResponse
);

router.patch(
  "/user-workspace/:workspaceId",
  checkAccessToken,
  verifyManager,
  workspaceValidator.updateDesignationWorkspaceSchema,
  workspaceCotroller.updateUserDesignationInWorkspace,
  genericResponse.sendResponse
);

router.delete(
  "/archive/:workspaceId",
  checkAccessToken,
  verifyManager,
  workspaceCotroller.archiveWorkspace,
  genericResponse.sendResponse
);

router.delete(
  "/user-workspace",
  checkAccessToken,
  verifyManager,
  workspaceCotroller.removeUserWorkspace,
  genericResponse.sendResponse
);

router.get(
  "/workspace",
  checkAccessToken,
  workspaceCotroller.myWorkspace,
  workspaceSerializer.getAllWorkspace,
  genericResponse.sendResponse
);

router.patch(
  "/open/:workspaceId",
  checkAccessToken,
  verifyManager,
  workspaceCotroller.openWorkspace,
  genericResponse.sendResponse
);

router.post(
  "/sprint",
  checkAccessToken,
  validator.sprintValidator.createSprintSchema,
  controllers.Sprint.createSprint,
  serializer.sprintSerializer.createSprint,
  genericResponse.sendResponse
);

router.patch(
  "/sprint/:sprintId",
  checkAccessToken,
  validator.sprintValidator.updateSprintSchema,
  controllers.Sprint.updateSprint,
  genericResponse.sendResponse
);

router.delete(
  "/archive/:sprintId",
  checkAccessToken,
  controllers.Sprint.archiveSprint,
  genericResponse.sendResponse
);

router.get(
  "/sprint/:workspaceId",
  checkAccessToken,
  controllers.Sprint.mySprint,
  serializer.sprintSerializer.getMySprint,
  genericResponse.sendResponse
);

router.patch(
  "/open/:sprintId",
  checkAccessToken,
  controllers.Sprint.openSprint,
  genericResponse.sendResponse
);

module.exports = router;
