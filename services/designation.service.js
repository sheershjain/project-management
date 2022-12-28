const models = require("../models");
const { sequelize } = require("../models");

const updateDesignation = async (payload) => {
  const findUser = await models.User.findOne({
    where: { id: payload.userId },
  });

  if (!findUser) {
    throw new Error("user not found");
  }
  const checkDesignation = await models.UserDesignationMapping.findOne({
    where: { user_id: payload.userId, designation_id: payload.designationId },
  });

  if (checkDesignation) {
    throw new Error("This relation is already exist");
  }

  const designation = await models.UserDesignationMapping.update(
    {
      designation_id: payload.designationId,
    },
    { where: { user_id: payload.userId } }
  );

  return payload;
};

module.exports = {
  updateDesignation,
};
