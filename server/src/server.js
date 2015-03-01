'use strict';

var bodyParser = require('body-parser'),
    Express = require('express'),
    mongoose = require('mongoose'),
    UserManager = require('./session/UserManager'),
    RoomManager = require('./room_objects/RoomManager.js');

var Server = function (exp, socketIO, dbOptions) {
    this.app = exp;
    this._socketIO = socketIO;
    this._setupHttpServer();
    this._setupDatabase(dbOptions);

    this._userManager = new UserManager(this._db);

    this._setupMiddleware();
};

Server.prototype = {
    _connectDB: function(hostname, dbName) {
        this._db.connect('mongodb://' + hostname + '/' + dbName);
    },
    _disconnectDB: function() {
        this._db.disconnect();
    },
    _setupDatabase: function(dbOptions) {
        this._db = mongoose;
        this._dbHostname = '127.0.0.1';
        this._dbName = 'whiteboard';

        if(dbOptions) {
            this._db = dbOptions.mongoose || this._db;
            this._dbHostname = dbOptions.hostname || this._dbHostname;
            this._dbName = dbOptions.name || this._dbName;
        }
    },
    _setupHttpServer: function() {
        this._port = process.env.PORT || 3000;
        this._hostname = '0.0.0.0';
    },
    _setupMiddleware: function() {
        this.app.use(bodyParser.json());
    },
    _setupRoutes: function() {
        this.app.use('/', Express.static(__dirname + '/../../client/web/app'));
        this.app.use('/api/user', this._userManager.getRouteF());
        this.app.use('/api/rooms/new', this._roomManager.getCreateRouteF());
        this.app.use('/api/rooms', this._roomManager.getRoomListRouteF());
    },
    start: function(port, hostname, listenCB) {
        this._port = port || this._port;
        this._hostname = hostname || this._hostname;
        this._connectDB(this._dbHostname, this._dbName);
        this._httpServ = this.app.listen(this._port, this._hostname, null, listenCB);
        this._socketManager = this._socketIO.listen(this._httpServ);
        this._roomManager = new RoomManager(this._socketManager, this._userManager);
        
        this._setupRoutes();
    },
    stop: function(closeCB) {
        this._disconnectDB();
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
