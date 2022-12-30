const Joi = require("joi");
const { validateRequest } = require("../helper/common-functions.helper");
const moment = require("moment");

module.exports = {
  createSprintSchema: async (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(2).required(),
      description: Joi.string().min(5).required(),
      deadline: Joi.date().required(),
      workspaceId: Joi.string().guid().required(),
    });

    validateRequest(req, res, next, schema, "body");
  },
};
