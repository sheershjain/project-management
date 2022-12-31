const { Router } = require("express");
const controllers = require("../controllers");
const {
  verifyAdmin,
  checkAccessToken,
} = require("../middlewares/auth.middleware");
const serializer = require("../serializers");
const genericResponse = require("../helper/generic-response.helper");
const validator = require("../validators");
const router = Router();

router.post(
  "/user",
  checkAccessToken,
  verifyAdmin,
  validator.userValidator.createUserSchema,
  controllers.User.createUser,
  serializer.userSerializer.createUser,
  genericResponse.sendResponse
);

router.get(
  "/users",
  checkAccessToken,
  verifyAdmin,
  controllers.User.getAllUser,
  serializer.userSerializer.getAllUser,
  genericResponse.sendResponse
);

router.get(
  "/user/:userId",
  checkAccessToken,
  verifyAdmin,
  controllers.User.getSingleUser,
  serializer.userSerializer.getSingleUser,
  genericResponse.sendResponse
);

router.patch(
  "/designation",
  checkAccessToken,
  verifyAdmin,
  validator.designationValidator.designationSchema,
  controllers.Designation.updateDesignation,
  genericResponse.sendResponse
);

module.exports = router;
