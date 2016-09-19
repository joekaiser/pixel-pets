//var mongo = require('mongodb').MongoClient;
var dbCollections = App.require('./db/dbCollections.js');
var db = {};

//db.login = function (un, pw) {
//    App.logger.log('verbose', 'Login requested for %s', un);
//    mongo.connect(App.config.db.connection, function (err, db) {
//        var collection = db.collection(dbCollections.users);
//        collection.find({
//            'username': un,
//            'password': pw
//        })
//    });
//};

module.exports = db;
