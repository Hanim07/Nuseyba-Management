const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');
const Role = require('./Role');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'permissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const RolePermission = sequelize.define('RolePermission', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  permission_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  }
}, {
  tableName: 'role_permissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id', as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id', as: 'roles' });

module.exports = { Permission, RolePermission };
