'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('userGroups', 'external', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: 'description'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('userGroups', 'external')
  }
};
