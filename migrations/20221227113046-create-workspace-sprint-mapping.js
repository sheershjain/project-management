"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("workspace_sprint_mapping", {
      id: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      workspaceId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "workspace",
          key: "id",
        },
      },
      sprintId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "sprint",
          key: "id",
        },
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("workspace_sprint_mapping");
  },
};
