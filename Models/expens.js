const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expens = sequelize.define('expens', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    Amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },

    Description: {
        type: Sequelize.STRING,
        allowNull: false
    },

    Category: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Expens;
