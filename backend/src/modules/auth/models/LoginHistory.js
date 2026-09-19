const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');
const User = require('./User');

const LoginHistory = sequelize.define('LoginHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  login_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ip_address: {
    type: DataTypes.STRING,
  },
  success: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  user_agent: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'login_history',
  timestamps: false,
});

LoginHistory.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(LoginHistory, { foreignKey: 'user_id', as: 'login_history' });

module.exports = LoginHistory;
