'use strict';
module.exports = (sequelize, DataTypes) => {
  const Schedulings = sequelize.define('Schedulings', {
    cod: DataTypes.INTEGER,
    saleProbability: DataTypes.INTEGER,
    dateScheduling: DataTypes.DATEONLY,
    hourScheduling: DataTypes.TIME,
    city: DataTypes.STRING,
    client: DataTypes.STRING,
    age: DataTypes.INTEGER,
    civilState: DataTypes.STRING,
    spouse: DataTypes.STRING,
    ageSpouse: DataTypes.INTEGER,
    telephone: DataTypes.STRING,
    cellphone: DataTypes.STRING,
    address: DataTypes.STRING,
    profession: DataTypes.STRING,
    referencePoint: DataTypes.STRING,
    linkMaps: DataTypes.STRING,
    observation: DataTypes.STRING,
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    externalUser: DataTypes.INTEGER,
    excluded: DataTypes.BOOLEAN
  }, {});
  Schedulings.associate = function (models) {
    Schedulings.hasMany(models.Users, {
      as: 'user',
      foreignKey: 'id',
      sourceKey: 'userId'
    })
    Schedulings.hasMany(models.Users, {
      as: 'externalUserId',
      foreignKey: 'id',
      sourceKey: 'externalUser'
    })

  };
  return Schedulings;
};