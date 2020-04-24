'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  
    return queryInterface.addColumn('Schedulings', 'status', {
      type: Sequelize.STRING,
      after: 'observation',
      defaultValue: 'Agendado'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Schedulings', 'status')
  }
};
