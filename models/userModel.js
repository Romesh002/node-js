const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    profileImg: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = User;