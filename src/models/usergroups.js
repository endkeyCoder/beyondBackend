'use strict';
module.exports = (sequelize, DataTypes) => {
  const userGroups = sequelize.define('userGroups', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    external: DataTypes.BOOLEAN
  }, {});
  userGroups.associate = function(models) {
    
  };
  return userGroups;
};