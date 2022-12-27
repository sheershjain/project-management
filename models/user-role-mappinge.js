"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class UserRolMappinge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "User",
      });

      this.belongsTo(models.Role, {
        foreignKey: "role_id",
        targetKey: "id",
        as: "Role",
      });
    }
  }
  UserRolMappinge.init(
    {
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "role",
          key: "id",
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "user_role_mapping",
      modelName: "UserRolMappinge",
    }
  );
  return UserRolMappinge;
};
