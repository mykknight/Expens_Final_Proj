const Sequelize = require('sequelize');

const sequelize = new Sequelize('expens_final', 'root', 'mayank2310', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;