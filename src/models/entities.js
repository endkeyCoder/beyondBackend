'use strict';

module.exports = (sequelize, DataTypes) => {
  const Entities = sequelize.define('Entities', {
    name: DataTypes.STRING,
    auxiliaryName: DataTypes.STRING
  }, {});
  Entities.associate = function (models) {
   
  };
  return Entities;
};