// database connection with mysql 

// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'node_js_db'
// });

// module.exports = pool.promise();

// database connection with sequelize

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_js_db', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;