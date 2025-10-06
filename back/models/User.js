const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referralCode: {
    type: DataTypes.STRING,
    unique: true,
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  referredBy: {
    type: DataTypes.STRING, // Pode armazenar o referralCode de quem indicou
    allowNull: true,
  },
}, {
  tableName: 'users',
});

User.beforeCreate((user) => {
  // Gera código de indicação único
  user.referralCode = uuidv4().slice(0, 8);
});

module.exports = User;
