'use strict';
module.exports = (sequelize, DataTypes) => {
  const prices = sequelize.define('prices', {
    id_product: DataTypes.INTEGER,
    value: DataTypes.DECIMAL,
    commission: DataTypes.DECIMAL
  }, {});
  prices.associate = function (models) {
    prices.hasMany(models.products, {
      as: 'product',
      foreignKey: 'id',
      sourceKey: 'id_product'
    })
  };
  return prices;
};