'use strict';

var express = require('express'),
    mongoose = require('mongoose'),
    UserSession = require('./UserSession');

var Server = function () {
    this.app = express();

    this.port = process.env.PORT || 3000;

    this._connectDB("localhost");

    this._userSession = new UserSession();

    this._setupRoutes();
};

Server.prototype = {
    _connectDB: function(hostname) {
        mongoose.connect('mongodb://' + hostname + '/whiteboard');
    },
    _setupRoutes: function() {
        this.app.use('/', express.static(__dirname + '/../../client/web/app'));
        this.app.use("/api/anonymousUser", this._userSession.authAnonymousRouteF());
        this.app.use("/api/user", this._userSession.authAnonymousRouteF());
    },
    start: function() {
        this.app.listen(this.port);
    }
};

module.exports = Server;
