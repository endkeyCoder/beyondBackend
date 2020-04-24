'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sales = sequelize.define('Sales', {
    schedulingId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    formPaymentId: DataTypes.INTEGER,
    planPaymentId: DataTypes.INTEGER,
    value: DataTypes.DECIMAL(10,2)
  }, {});
  Sales.associate = function(models) {
    // associations can be defined here
  };
  return Sales;
};