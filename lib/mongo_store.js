var MongoDBStore = function(opts) {
    var 
        DataStore = require("machinist-js").DataStore,
        Q = require('q'),
        MongoClient = require('mongodb').MongoClient,
        Server = require("mongodb").Server,
        _opts = opts,
        client;
    
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

    self.find = function(collection, query) {
        var deferred = Q.defer();
        MongoClient.connect(_opts.connectionUrl, function(err, db) {
            if(err) return deferred.reject(err);
            db.collection(collection).find(query).toArray(function(err, docs) {
                if(err) return deferred.reject(err);
                deferred.resolve(docs);
            });
        });
        return deferred.promise;
    };

    self.findOne = function(collection, query) {
        var deferred = Q.defer();
        MongoClient.connect(_opts.connectionUrl, function(err, db) {
            if(err) deferred.reject(err);
            db.collection(collection).findOne(query, function(err, doc) {
                if(err) deferred.reject(err);
                deferred.resolve(doc);
            });
        });
        return deferred.promise;
    };

    self.findOrMake = function(collection, obj) {
        var deferred = Q.defer();
        var promise = self.find(collection, obj);
        promise.then(
            function(docs) {
                if(docs && docs.length > 0) {
                    deferred.resolve(docs[0]);
                } else {
                    deferred.resolve(self.make(collection, obj));
                }
            },
            function(err){
                if(err) deferred.reject(err);
            }
        );
        return deferred.promise;
    };

    self.make = function(collection, obj) {
        var deferred = Q.defer();
        MongoClient.connect(_opts.connectionUrl, function(err, db) {
            if(err) deferred.reject(err);
            db.collection(collection).insert(obj, function(err, docs){
                if(err) deferred.reject(err);
                if(docs.length > 0) {
                    deferred.resolve(docs[0]);
                } else {
                    deferred.resolve(null);
                }
                
            });
        });
        return deferred.promise;
    };

    self.clear = function(collection, args) {
        var deferred = Q.defer();
        MongoClient.connect(_opts.connectionUrl, function(err, db) {
            if(err) deferred.reject(err);
            db.collection(collection).remove(args, function(err){
                if(err) deferred.reject(err);
                deferred.resolve();
            });
        });
        return deferred.promise;
    };

    self.clearAll = function(args) {
        var deferred = Q.defer();
        MongoClient.connect(_opts.connectionUrl, function(err, db) {
            if(err) deferred.reject(err);
            db.dropDatabase(function(err, result){
                if(err) deferred.reject(err);
                deferred.resolve(result);
            });
        });
        return deferred.promise;
    };

    return self;

};

module.exports = MongoDBStore;