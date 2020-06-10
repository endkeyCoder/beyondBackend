'use strict';

module.exports = (sequelize, DataTypes) => {
  const Permissions = sequelize.define('Permissions', {
    groupId: DataTypes.INTEGER,
    add: DataTypes.BOOLEAN,
    read: DataTypes.BOOLEAN,
    update: DataTypes.BOOLEAN,
    delete: DataTypes.BOOLEAN,
    all: DataTypes.BOOLEAN,
    entityId: DataTypes.INTEGER,
  }, {});
  Permissions.associate = function (models) {
    Permissions.hasMany(models.Entities, {
      as: 'entity',
      foreignKey: 'id',
      sourceKey: 'entityId'
    })
    Permissions.hasMany(models.userGroups, {
      as: 'userGroup',
      foreignKey: 'id',
      sourceKey: 'groupId'
    })
  };
  return Permissions;
};