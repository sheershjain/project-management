'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init({
    roleCode: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      roleTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      }
  }, {
    sequelize,
    paranoid: true,
    tableName: "role",
    modelName: 'Role',
  });
  return Role;
};