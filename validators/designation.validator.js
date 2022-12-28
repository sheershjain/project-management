const Joi = require("joi");
const { validateRequest } = require("../helper/common-functions.helper");

module.exports = {
  designationSchema: async (req, res, next) => {
    const schema = Joi.object({
      userId: Joi.string().guid().required(),
      designationId: Joi.string().guid().required(),
    });

    validateRequest(req, res, next, schema, "body");
  },
};
