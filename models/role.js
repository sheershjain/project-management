"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {
        through: models.UserRolMappinge,
        foreignKey: "role_id",
        sourceKey: "id",
        as: "User",
      });
    }
  }
  Role.init(
    {
      roleTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "role",
      modelName: "Role",
    }
  );
  return Role;
};
