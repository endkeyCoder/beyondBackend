'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    nick: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    email: DataTypes.STRING,
    block: DataTypes.BOOLEAN,
    groupId: DataTypes.INTEGER
  }, {});
  Users.associate = function(models) {
    Users.hasMany(models.userGroups, {
      as:'userGroup',
      foreignKey: 'id',
      sourceKey: 'groupId'
    })
  };
  return Users;
};