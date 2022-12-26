'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class TaskComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TaskComment.belongsTo(models.Task, {
        foreignKey: 'task_id',
        targetKey: 'id'
      });
      TaskComment.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'id'
      });
    }
  }
  TaskComment.init({
    comment: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      task_id: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: "task",
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
    tableName: "task_comments",
    modelName: 'TaskComment',
  });
  return TaskComment;
};