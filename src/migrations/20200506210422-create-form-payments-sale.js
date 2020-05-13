'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('formPaymentsSales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idSale: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Sales',
          key: 'id'
        }
      },
      idFormPayment: {
        type: Sequelize.INTEGER,
        references:{
          model: 'formPayments',
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
    return queryInterface.dropTable('formPaymentsSales');
  }
};