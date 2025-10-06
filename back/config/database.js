const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_desafio_tecnico', 'root', '220206gva', {
  host: 'localhost',
  dialect: 'mariadb',
});

module.exports = sequelize;
