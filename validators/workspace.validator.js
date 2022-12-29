const Joi = require("joi");
const { validateRequest } = require("../helper/common-functions.helper");

module.exports = {
  workspaceSchema: async (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      description: Joi.string().min(5).required(),
    });

    validateRequest(req, res, next, schema, "body");
  },
};
