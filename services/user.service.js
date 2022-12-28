const models = require("../models");
const { sequelize } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const mailer = require("../helper/send-mail.helper");

const createUser = async (payload) => {
  const password = randomstring.generate(7);
  const trans = await sequelize.transaction();
  try {
    const existingUser = await models.User.findOne(
      {
        where: { email: payload.email },
      },
      { transaction: trans }
    );
    if (existingUser) {
      throw new Error("User already exists");
    }

    payload.password = await bcrypt.hash(password, 10);
    const user = await models.User.create(payload, { transaction: trans });

    if (!user) {
      throw new Error("Something went wrong");
    }
    const userId = user.dataValues.id;

    if (payload.designationCode) {
      const designation = await models.Designation.findOne(
        {
          where: {
            designation_code: payload.designationCode,
          },
        },
        { transaction: trans }
      );

      if (!designation) {
        throw new Error("Invalid Designation");
      }
      const designationUserMappingDesignationID =
        await models.UserDesignationMapping.create(
          {
            designation_id: designation.dataValues.id,
            user_id: userId,
          },
          { transaction: trans }
        );
      if (!designationUserMappingDesignationID) {
        throw new Error("Something went wrong");
      }
    }
    if (payload.roleKey) {
      const role = await models.Role.findOne(
        {
          where: {
            role_key: payload.roleKey,
          },
        },
        { transaction: trans }
      );

      if (!role) {
        throw new Error("Invalid Role");
      }
      const userRoleMapping = await models.UserRoleMapping.create(
        {
          user_id: userId,
          role_id: role.id,
        },
        { transaction: trans }
      );

      if (!userRoleMapping) {
        throw new Error("Something went wrong");
      }
    }
    await trans.commit();
    const body = `your project management passsword is- ${password}`;
    const subject = "project management registration";
    const recipient = payload.email;
    mailer.sendMail(body, subject, recipient);
    return "user created successufully";
  } catch (error) {
    await trans.rollback();
    console.log(error.message);
    return { data: null, error: error };
  }
};

module.exports = {
  createUser,
};
