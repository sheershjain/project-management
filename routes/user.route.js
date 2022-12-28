const { Router } = require("express");
const controllers = require("../controllers");
const { verifyAdmin, checkAccessToken } = require("../middlewares/auth");
const genericResponse = require("../helper/generic-response.helper");
const validator = require("../validators");
const router = Router();

router.post(
  "/user",
  //   checkAccessToken,
  //   verifyAdmin,
  validator.userValidator.createUserSchema,
  controllers.User.createUser,
  genericResponse.sendResponse
);

router.post(
  "/login",
  validator.userValidator.loginSchema,
  controllers.User.loginUser,
  genericResponse.sendResponse
);

router.get(
  "/users",
  checkAccessToken,
  verifyAdmin,
  // validator.userValidator.createUserSchema,
  controllers.User.getAllUser,
  genericResponse.sendResponse
);

module.exports = router;
