const Joi = require("joi");
const { validateRequest } = require("../helper/common-functions.helper");

module.exports = {
  createTaskSchema: async (req, res, next) => {
    const schema = Joi.object({
      task: Joi.string().min(3).required(),
      description: Joi.string().min(5).required(),
      pointer: Joi.string().required(),
      deadline: Joi.string().min(3).required(),
      sprintId: Joi.string().min(3).required(),
      userId: Joi.string().min(3).required(),
    });

    validateRequest(req, res, next, schema, "body");
  },
};
