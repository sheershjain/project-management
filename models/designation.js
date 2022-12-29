"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class Designation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {
        through: models.UserDesignationMapping,
        foreignKey: "designation_id",
        sourceKey: "id",
        as: "User",
      });

      this.belongsToMany(models.Workspace, {
        through: models.UserWorkspaceMapping,
        foreignKey: "user_id",
        as: "Workspace",
      });
    }
  }
  Designation.init(
    {
      designationCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      designationTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true,
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "designation",
      modelName: "Designation",
    }
  );
  return Designation;
};
