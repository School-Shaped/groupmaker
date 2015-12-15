'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'Students',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        name: {
          type: Sequelize.STRING
        },
        male: {
          type: Sequelize.BOOLEAN
        },
        leadership: {
          type: Sequelize.INTEGER
        },
        speed: {
          type: Sequelize.INTEGER
        },
        behavior: {
          type: Sequelize.INTEGER
        },
        ClassId: {
          type: Sequelize.BIGINT,
          references: { model: "Classes", key: "id" },          
          onUpdate: "CASCADE",
          onDelete: "RESTRICT"
        }
      }
    )
  },

  down: function (queryInterface, Sequelize) {    
      return queryInterface.dropTable('Students');    
  }
};
