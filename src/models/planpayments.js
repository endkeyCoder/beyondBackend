'use strict';
module.exports = (sequelize, DataTypes) => {
  const planPayments = sequelize.define('planPayments', {
    title: DataTypes.STRING,
    qttPlots: DataTypes.INTEGER,
    entry: DataTypes.BOOLEAN
  }, {});
  planPayments.associate = function (models) {
    // associations can be defined here
  };
  return planPayments;
};