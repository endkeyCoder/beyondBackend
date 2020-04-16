'use strict';
module.exports = (sequelize, DataTypes) => {
  const Schedulings = sequelize.define('Schedulings', {
    saleProbability: DataTypes.INTEGER,
    dateScheduling: DataTypes.DATE,
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
    userId: DataTypes.INTEGER,
    externalUser: DataTypes.INTEGER
  }, {});
  Schedulings.associate = function(models) {
    // associations can be defined here
  };
  return Schedulings;
};