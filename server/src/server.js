'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    UserManager = require('./session/UserManager');

var Server = function () {
    this.app = express();
    this._db = mongoose;
    
    this.port = process.env.PORT || 3000;
    this.hostname = '0.0.0.0';
    this.dbHostname = '127.0.0.1';

    this._userManager = new UserManager(this._db);
    
    this._setupMiddleware();
    this._setupRoutes();

};

Server.prototype = {
    _connectDB: function(hostname) {
        mongoose.connect('mongodb://' + hostname + '/whiteboard');
    },
    _disconnectDB: function() {
        mongoose.disconnect();
    },
    _setupMiddleware: function() {
        this.app.use(bodyParser.json());
    },
    _setupRoutes: function() {
        this.app.use('/', express.static(__dirname + '/../../client/web/app'));
        this.app.use('/api/user', this._userManager.getRouteF());
    },
    start: function(port, hostname, listenCB) {
        this.port = port || this.port;
        this.hostname = hostname || this.hostname;
        this._connectDB(this.dbHostname);
        this.httpServ = this.app.listen(this.port, this.hostname, null, listenCB);
    },
    stop: function(closeCB) {
        this._disconnectDB();
        if(this.httpServ){
            console.log('Stopping server...');
            this.httpServ.close(closeCB);
        }
    }
};

module.exports = Server;
