const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    UserName: {
        type: Sequelize.STRING,
        allowNull: false
    },

    Email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    Password: {
        type: Sequelize.STRING,
        allowNull: false
    },

    ispremiumuser: Sequelize.BOOLEAN,
    TotalCost: Sequelize.INTEGER
})

module.exports = User;