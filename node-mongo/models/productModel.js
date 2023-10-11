const getDb = require('../utils/database').getDb;
const mongodb = require('mongodb');

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
    
            dbOp = db.collection('products')
                .updateOne(
                    { _id: this._id },
                    { $set: this }
                )
        } else {
            console.log('create condition')
            dbOp = db.collection('products').insertOne(this)
        }
        return dbOp.then(result => {
            console.log(result)
        })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products').find({ _id: new mongodb.ObjectId(id) }).next().then(product => {
            console.log(product);
            return product;
        }).catch(err => { console.log(err) })

    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id) }).then(result => console.log(result)).catch(err => console.log(err));
    }
}

// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');
// const mongoConnect = require('../utils/database');

// const Product = sequelize.define('products', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false,
//     },
//     // userId: {
//     //     type: Sequelize.DOUBLE,
//     //     allowNull: false,
//     // },
// });

module.exports = Product;

