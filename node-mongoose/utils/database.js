// 
// const Sequelize = require('sequelize');
// 
// const sequelize = new Sequelize('node_js_db', 'root', 'root', {
// dialect: 'mysql',
// host: 'localhost'
// });
// 
// module.exports = sequelize;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://root:QDf35FrKjyNyh8WI@atlascluster.4gcjhvv.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp')
        .then(client => {
            console.log('Mongodb Connected');
            _db = client.db();
            callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No Database Found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

