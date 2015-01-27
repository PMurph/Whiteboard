'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    UserSession = require('./UserSession');

var Server = function () {
    this.app = express();

    this.port = process.env.PORT || 3000;
    this.hostname = "127.0.0.1";
    this.dbHostname = "127.0.0.1";

    this._userSession = new UserSession();
    
    /* BodyParser must be added before routes 
     * for handlers to see parsed JSON data */
    this.app.use(bodyParser.json());
    this._setupRoutes();

};

Server.prototype = {
    _connectDB: function(hostname) {
        mongoose.connect('mongodb://' + hostname + '/whiteboard');
    },
    _disconnectDB: function() {
        mongoose.disconnect();
    },
    _setupRoutes: function() {
        this.app.use('/', express.static(__dirname + '/../../client/web/app'));
        this.app.use("/api/user", this._userSession.routeF());
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
            console.log("Stopping server...");
            this.httpServ.close(closeCB);
        }
    }
};

module.exports = Server;
