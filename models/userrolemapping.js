'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class UserRoleMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       this.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
      this.belongsTo(models.Role, {
        foreignKey: 'role_id'
      });
    }
  }
  UserRoleMapping.init({
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: 'id'
        }
      },
      role_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "role",
          key: 'id'
        }
      }
  }, {
    sequelize,
    paranoid: true,
    tableName: "user_role_mapping",
    modelName: 'UserRoleMapping',
  });
  return UserRoleMapping;
};