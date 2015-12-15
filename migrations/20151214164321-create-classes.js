'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {    
    return queryInterface.createTable('Classes', { 
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
      UserId: {
        type: Sequelize.BIGINT,
        references: { model: "Users", key: "id" },          
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      }
    });    
  },

  down: function (queryInterface, Sequelize) {   
    return queryInterface.dropTable('Classes');   
  }
};
