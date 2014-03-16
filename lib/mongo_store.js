var MongoDBStore = function(opts) {
    var 
        DataStore = require("machinist-js").DataStore,
        MongoClient = require('mongodb').MongoClient,
        Server = require("mongodb").Server,
        _opts = opts,
        client;
    console.log("creating MongoDBStore with opts %j", _opts);
    if(!_opts.connectionUrl && !_opts.host && !_opts.port) {
        _opts.connectionUrl = 'mongodb://localhost:27017/';
    } else if(!_opts.connectionUrl && _opts.host && !_opts.port) {
        _opts.connectionUrl = 'mongodb://'+ _opts.host + ':27017/';
    } else if(!_opts.connectionUrl && _opts.host && _opts.port) {
        _opts.connectionUrl = 'mongodb://'+ _opts.host + ':'+ _opts.port + '/';
    } 

    if(_opts.database) {
        _opts.connectionUrl += _opts.database;
    }
    

    var self = DataStore(_opts);

    var _connect = function(callback) {
        console.log("attempting to connect to %s", _opts.connectionUrl);
        MongoClient.connect(_opts.connectionUrl, function(err, db) {
            console.log("connected err? %s", err);
            if(err) throw err;
            return callback(db, function() {
                db.close();
            });
        });
    };

    self.find = function(collection, query) {

    };

    self.findOne = function(collection, id) {

    };

    self.findOrMake = function(collection, obj) {

    };

    self.make = function(collection, obj, callback) {
        console.log("calling make with %s and object %j and callback %s", collection, obj, callback);
        MongoClient.connect(_opts.connectionUrl, function(err, db) {
            console.log("connected err? %s", err);
            if(err) throw err;
            db.collection(collection).insert(obj, function(err, docs){
                console.log("attempting to save to collection %s err? %s", collection, err);
                return callback(err, docs);
            });
        });
        // _connect(function(db, done){
        //     console.log("got db connection back");
        //     db.collection(collection).insert(obj, function(err, docs){
        //         console.log("attempting to save to collection %s err? %s", collection, err);
        //         return callback(err, docs);
        //          done();
        //     });
        // });

    };

    return self;

};

module.exports = MongoDBStore;