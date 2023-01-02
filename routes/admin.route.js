const { Router } = require("express");
const userController = require("../controllers/user.controller");
const designationController = require("../controllers/designation.controller");
const {
  verifyAdmin,
  checkAccessToken,
} = require("../middlewares/auth.middleware");
const userSerializer = require("../serializers/user.serializer");
const genericResponse = require("../helpers/generic-response.helper");
const userValidator = require("../validators/user.validator");
const designationValidator = require("../validators/designation.validator");
const router = Router();

router.post(
  "/user",
  checkAccessToken,
  verifyAdmin,
  userValidator.createUserSchema,
  userController.createUser,
  userSerializer.createUser,
  genericResponse.sendResponse
);

router.get(
  "/users",
  checkAccessToken,
  verifyAdmin,
  userController.getAllUser,
  userSerializer.getAllUser,
  genericResponse.sendResponse
);

router.get(
  "/user/:userId",
  checkAccessToken,
  verifyAdmin,
  userController.getSingleUser,
  userSerializer.getSingleUser,
  genericResponse.sendResponse
);
router.delete(
  "/user/:userId",
  checkAccessToken,
  verifyAdmin,
  userController.deactivateUser,
  genericResponse.sendResponse
);

router.patch(
  "/designation/:userId",
  checkAccessToken,
  verifyAdmin,
  designationValidator.designationSchema,
  designationController.updateDesignation,
  genericResponse.sendResponse
);

router.get(
  "/workspace",
  checkAccessToken,
  verifyAdmin,
  controllers.Workspace.getAllWorkSpace,
  serializer.workspaceSerializer.getAllWorkspace,
  genericResponse.sendResponse
);

module.exports = router;
