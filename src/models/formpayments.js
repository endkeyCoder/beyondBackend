'use strict';
module.exports = (sequelize, DataTypes) => {
  const formPayments = sequelize.define('formPayments', {
    title: DataTypes.STRING,
    rate: DataTypes.DECIMAL(3, 2),
  }, {});
  formPayments.associate = function (models) {
    // associations can be defined here
  };
  return formPayments;
};