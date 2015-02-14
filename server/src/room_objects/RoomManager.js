'use strict';
var RoomFactory = require('./RoomFactory');

var RoomManager = function(socketManager, userManager) {
    this._roomFactory = new RoomFactory();
    this._rooms = {};
    this._userManager = userManager;
    
    this._initSocketCallbacks(socketManager);
};

RoomManager.prototype = {
    _initSocketCallbacks: function(socketManager) {
        var self = this;

        socketManager.use(function(socket, next) {
            var authToken = socket.request._query.authToken;
            self._userManager.findByAuthToken(authToken, function(error, user) {
                self.authenticateUser(error, user, function() {
                    next();
                });
            });
        });

        socketManager.on("connection", function(socket) {
            socket.on("joinRequest", function(msgData) {
                self._userManager.findByAuthToken(msgData.authToken, function(error, user) {
                    self.authenticateUser(error, user, function() {
                        self.joinRoom(msgData.roomId, user, socket);
                    });
                });
            });
        });
    },

    authenticateUser: function(error, user, callback) {
        if(user && !error) {
            callback();
        }
    },

    joinRoom: function(roomId, user, socket) {
        var room = this._rooms[roomId];
        if(room) {
            socket.join(roomId);
            room.connectUserToRoom(user);
        }
    },

    createNewRoom: function(creatingUser) {
        var room = this._roomFactory.createNewRoom(creatingUser);
        var roomId = room.getId();
        this._rooms[roomId] = room;
        return roomId;
    },

    getRoom: function(roomId) {
        return this._rooms[roomId];
    },
};

module.exports = RoomManager;