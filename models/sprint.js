'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Sprint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       Sprint.belongsTo(models.Tag, {
        foreignKey: 'tag_id',
        targetKey: 'id'
      });
    }
  }
  Sprint.init({
    name: {
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
      tag_id: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: "tag",
        key: 'id'
      }
    },
  }, {
    sequelize,
    paranoid: true,
    tableName: "sprint",
    modelName: 'Sprint',
  });
  return Sprint;
};