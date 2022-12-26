'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Workspace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Workspace.init({
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
  }, {
    sequelize,
    paranoid: true,
    tableName: "workspace",
    modelName: 'Workspace',
  });
  return Workspace;
};