const Joi = require("joi");
const { validateRequest } = require("../helper/common-functions.helper");

module.exports = {
  designationSchema: async (req, res, next) => {
    const schema = Joi.object({
      designationId: Joi.string().guid().required(),
    });

    validateRequest(req, res, next, schema, "body");
  },
};
