'use strict';

var express = require('express');

var Server = function () {
    this.app = express();

    this.port = process.env.PORT || 3000;

    this._setupRoutes();
};

Server.prototype = {
    _setupRoutes: function() {
        this.app.use('/', express.static(__dirname + '/../../client/web/app'));
    },
    start: function() {
        this.app.listen(this.port);
    }
};

module.exports = Server;
