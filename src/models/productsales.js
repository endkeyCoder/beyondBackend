'use strict';
module.exports = (sequelize, DataTypes) => {
  const productSales = sequelize.define('productSales', {
    idSale: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER,
    value: DataTypes.DECIMAL
  }, {});
  productSales.associate = function (models) {
    // associations can be defined here
    productSales.hasMany(models.products, {
      as: 'product',
      foreignKey: 'id',
      sourceKey: 'idProduct'
    })
    productSales.hasMany(models.Sales, {
      as: 'sale',
      foreignKey: 'id',
      sourceKey: 'idSale'
    })
  };
  return productSales;
};