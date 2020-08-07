'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    excluded: DataTypes.BOOLEAN,
    aboutPrice: DataTypes.NUMERIC(10, 2)
  }, {});
  products.associate = function (models) {
    // associations can be defined here
    products.hasMany(models.prices, {
      as: 'price',
      foreignKey: 'id_product',
      sourceKey: 'id'
    })
    products.hasMany(models.productSales, {
      as: 'item',
      foreignKey: 'idProduct',
      sourceKey: 'id'
    })
  };
  return products;
};