'use strict';

var bodyParser = require('body-parser'),
    Express = require('express'),
    mongoose = require('mongoose'),
    UserManager = require('./session/UserManager');

var Server = function (exp, dbOptions) {
    this.app = exp;
    this._db = mongoose;
    
    this._port = process.env.PORT || 3000;
    this._hostname = '0.0.0.0';
    this._dbHostname = '127.0.0.1';
    this._dbName = 'whiteboard';

    if(dbOptions) {
        this._db = dbOptions.mongoose || this._db;
        this._dbHostname = dbOptions.hostname || this._dbHostname;
        this._dbName = dbOptions.name || this._dbName;
    }

    this._userManager = new UserManager(this._db);

    this._setupMiddleware();
    this._setupRoutes();

};

Server.prototype = {
    _connectDB: function(hostname, dbName) {
        this._db.connect('mongodb://' + hostname + '/' + dbName);
    },
    _disconnectDB: function() {
        this._db.disconnect();
    },
    _setupMiddleware: function() {
        this.app.use(bodyParser.json());
    },
    _setupRoutes: function() {
        this.app.use('/', Express.static(__dirname + '/../../client/web/app'));
        this.app.use('/api/user', this._userManager.getRouteF());
    },
    start: function(port, hostname, listenCB) {
        this._port = port || this._port;
        this._hostname = hostname || this._hostname;
    //    this._connectDB(this.dbHostname, this.dbName);
        this._httpServ = this.app.listen(this._port, this._hostname, null, listenCB);
    },
    stop: function(closeCB) {
        //this._disconnectDB();
        if(this._httpServ){
            console.log('Stopping server...');
            this._httpServ.close(closeCB);
        }
    },
    getPort: function() {
        return this._port;
    },
    getHostname: function() {
        return this._hostname;
    },
    getDBHostname: function() {
        return this._dbHostname;
    },
    getDBName: function() {
        return this._dbName;
    }
};

module.exports = Server;
