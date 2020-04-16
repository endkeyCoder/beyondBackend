'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Schedulings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      saleProbability: {
        type: Sequelize.INTEGER
      },
      dateScheduling: {
        type: Sequelize.DATE
      },
      hourScheduling: {
        type: Sequelize.TIME
      },
      city: {
        type: Sequelize.STRING
      },
      client: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      civilState: {
        type: Sequelize.STRING
      },
      spouse: {
        type: Sequelize.STRING
      },
      telephone: {
        type: Sequelize.STRING
      },
      cellphone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      profession: {
        type: Sequelize.STRING
      },
      referencePoint: {
        type: Sequelize.STRING
      },
      linkMaps: {
        type: Sequelize.STRING
      },
      observation: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      externalUser: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
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
    return queryInterface.dropTable('Schedulings');
  }
};