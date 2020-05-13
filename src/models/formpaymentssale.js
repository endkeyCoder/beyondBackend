'use strict';
module.exports = (sequelize, DataTypes) => {
  const formPaymentsSale = sequelize.define('formPaymentsSale', {
    idSale: DataTypes.INTEGER,
    idFormPayment: DataTypes.INTEGER,
    value: DataTypes.DECIMAL(10,2),
    entry: DataTypes.BOOLEAN
  }, {});
  formPaymentsSale.associate = function(models) {
    formPaymentsSale.hasMany(models.Sales, {
      as: 'sale',
      foreignKey: 'id',
      sourceKey: 'idSale'
    })
    formPaymentsSale.hasMany(models.formPayments, {
      as: 'formPayment',
      foreignKey: 'id',
      sourceKey: 'idFormPayment'
    })
  };
  return formPaymentsSale;
};