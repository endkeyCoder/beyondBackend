'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.addColumn('Schedulings', 'ageSpouse', {
      type: Sequelize.INTEGER,
      after: 'spouse'
    })
  },

  down: (queryInterface, Sequelize) => {
    
    return queryInterface.removeColumn('Schedulings', 'ageSpouse')
  }
};
