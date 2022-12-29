"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class UserWorkspaceMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Workspace, {
        foreignKey: "workspace_id",
        targetKey: "id",
        as: "Workspace",
      });

      this.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "User",
      });

      this.belongsTo(models.Designation, {
        foreignKey: "designation_id",
        targetKey: "id",
        as: "Designation",
      });
    }
  }
  UserWorkspaceMapping.init(
    {
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
      designation_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "designation",
          key: "id",
        },
      },
      workspace_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "workspace",
          key: "id",
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "user_workspace_mapping",
      modelName: "UserWorkspaceMapping",
    }
  );
  return UserWorkspaceMapping;
};
