const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('referral_system', 'root', 'SENHA_DO_BANCO', {
  host: 'localhost',
  dialect: 'mysql', // ou 'postgres' se preferir
});

module.exports = sequelize;
