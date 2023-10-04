// Database Model using mysql

// const db = require('../utils/database');

// const getProductsFromFile = cb => {
//     fs.readFile(p, (err, fileContent) => {
//         if (err) {
//             cb([]);
//         } else {
//             cb(JSON.parse(fileContent));
//         }
//     });
// };

// module.exports = class Product {
//     constructor(id, title, imageUrl, description, price) {
//         this.id = id,
//             this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

//     save() {
//         return db.execute('INSERT INTO products (title,imageUrl,description,price) VALUES(?,?,?,?)', [
//             this.title,
//             this.imageUrl,
//             this.description,
//             this.price
//         ])
//     }

//     static fetchAll() {
//         return db.execute('SELECT * FROM products');
//     }

//     static findById(id) {
//         return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//     }

//     static DeleteById(id) {

//     }
// };

// Database Model using mysql

const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('products', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    // userId: {
    //     type: Sequelize.DOUBLE,
    //     allowNull: false,
    // },
});

module.exports = Product;

