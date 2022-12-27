'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class UserSprintMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      this.belongsTo(models.Sprint, {
        foreignKey: 'sprintId'
      });
    }
  }
  UserSprintMapping.init({
    userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: 'id'
        }
      },
      sprintId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "sprint",
          key: 'id'
        }
      }
  }, {
    sequelize,
    paranoid: true,
    tableName: "user_sprint_mapping",
    modelName: 'UserSprintMapping',
  });
  return UserSprintMapping;
};