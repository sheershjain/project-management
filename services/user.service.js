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

const loginUser = async (payload) => {
  const { email, password } = payload;

  const user = await models.User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("User Not Found!");
  }

  const match = await bcrypt.compare(password, user.dataValues.password);
  if (!match) {
    throw new Error("Wrong credentials");
  }

  const accessToken = jwt.sign(
    { userId: user.dataValues.id },
    process.env.SECRET_KEY_ACCESS
    // {
    //     expiresIn: process.env.JWT_ACCESS_EXPIRATION
    // }
  );
  const refreshToken = jwt.sign(
    { userId: user.dataValues.id },
    process.env.SECRET_KEY_REFRESH
    // {
    //     expiresIn: process.env.JWT_REFRESH_EXPIRATION
    // }
  );

  delete user.dataValues.password;

  return {
    id: user.id,
    email: user.email,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const getAllUser = async (query) => {
  let limit = query.page == 0 ? null : 3;
  let page = query.page < 2 ? 0 : query.page;

  const users = await models.User.findAll({
    attributes: {
      exclude: ["created_at", "updated_at", "deleted_at", "password"],
    },
    // limit: limit,
    // offset: page*3
  });
  return users;
};

module.exports = {
  createUser,
  loginUser,
  getAllUser,
};
