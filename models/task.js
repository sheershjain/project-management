'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.Sprint, {
        foreignKey: 'sprint_id',
        targetKey: 'id'
      });
      Task.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'id'
      });
    }
  }
  Task.init({
    task: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      pointer: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      sprint_id: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: "sprint",
        key: 'id'
      }
      },
      user_id: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: "user",
        key: 'id'
      }
    }
  }, {
    sequelize,
    paranoid: true,
    tableName: "task",
    modelName: 'Task',
  });
  return Task;
};