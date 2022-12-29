const jwt = require("jsonwebtoken");
const models = require("../models");
const checkAccessToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const token = header ? header.split(" ")[1] : null;
    if (!token) {
      throw new Error("Access denied");
    }

    let decoded_jwt = jwt.verify(token, process.env.SECRET_KEY_ACCESS);
    const user = await models.User.findOne({
      where: {
        id: decoded_jwt.userId,
      },
      include: [
        {
          model: models.Role,
          as: "Role",
        },
        {
          model: models.Designation,
          as: "Designation",
        },
      ],
    });
    if (!user) {
      throw new Error("User Not found");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const verifyAdmin = (req, res, next) => {
  try {
    if (req.user.Role[0].roleCode == 1001) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    return res.status(500).json({ message: `Something went wrong!` });
  }
};

const verifyManager = (req, res, next) => {
  try {
    if (req.user.Designation[0].designationCode == 102) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    return res.status(500).json({ message: `Something went wrong!` });
  }
};

module.exports = {
  checkAccessToken,
  verifyAdmin,
  verifyManager,
};
