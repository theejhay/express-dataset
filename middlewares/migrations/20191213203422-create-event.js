'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      type: {
        type: Sequelize.STRING
      },
      actor_id: {
        type: Sequelize.BIGINT,
        onDelete:'CASCADE',
        references:{
          model: 'Actors',
          key: 'id'
        }
      },
      repo_id: {
        type: Sequelize.BIGINT,
        onDelete:'CASCADE',
        references:{
          model: 'Repos',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Events');
  }
};