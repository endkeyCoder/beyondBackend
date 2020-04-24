'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      schedulingId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Schedulings',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      formPaymentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'formPayments',
          key: 'id'
        }
      },
      planPaymentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'planPayments',
          key: 'id'
        }
      },
      value: {
        type: Sequelize.DECIMAL(10, 2)
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
    return queryInterface.dropTable('Sales');
  }
};