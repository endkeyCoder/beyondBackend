'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sales = sequelize.define('Sales', {
    schedulingId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    planPaymentId: DataTypes.INTEGER,
    value: DataTypes.DECIMAL(10, 2),
    observation: DataTypes.STRING
  }, {});
  Sales.associate = function (models) {
    Sales.hasMany(models.Schedulings, {
      as: 'scheduling',
      foreignKey: 'id',
      sourceKey: 'schedulingId'
    })
    Sales.hasMany(models.planPayments, {
      as: 'planPayment',
      foreignKey: 'id',
      sourceKey: 'planPaymentId'
    })
    Sales.hasMany(models.Users, {
      as: 'user',
      foreignKey: 'id',
      sourceKey: 'userId'
    })
    Sales.hasMany(models.formPaymentsSale, {
      as: 'formPaymentsId',
      foreignKey: 'idSale',
      sourceKey: 'id'
    })
    Sales.hasMany(models.productSales, {
      as: 'productsSale',
      foreignKey: 'idSale',
      sourceKey: 'id'
    })
  };
  return Sales;
};