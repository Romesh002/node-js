const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    // price: {
    //     type: Sequelize.DOUBLE,
    //     allowNull: false,
    // }
});

module.exports = OrderItem;