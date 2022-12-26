'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Sprint, {
        foreignKey: 'tagId',
        targetKey: 'id'
      });
      this.belongsTo(models.Workspace, {
        foreignKey: 'workspaceId',
        targetKey: 'id'
      });
    }
  }
  Tag.init({
      tag: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      deadline: {
        type: Sequelize.DATE,
        allowNull: false,
      }, 
      workspaceId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: "workspace",
        key: 'id'
      }
    },
  }, {
    sequelize,
    paranoid: true,
    tableName: "tag",
    modelName: 'Tag',
  });
  return Tag;
};