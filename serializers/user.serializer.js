const { date } = require("joi");

const createUser = async (req, res, next) => {
  const data = res.data || null;
  console.log(data, "---------------");
  const response = {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    roleKey: data.roleKey,
  };
  res.data = response;
  next();
};
const getAllUser = async (req, res, next) => {
  const data = res.data || null;

  const serializedData = [];

  data.forEach((item) => {
    const user = {
      id: item.dataValues.id,
      firstName: item.dataValues.firstName,
      lastName: item.dataValues.lastName,
      email: item.dataValues.email,
      designationTitle: item.Designation[0].designationTitle,
    };
    serializedData.push(user);
  });

  res.data = serializedData;
  next();
};

module.exports = {
  createUser,
  getAllUser,
};
