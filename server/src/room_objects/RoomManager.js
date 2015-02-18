'use strict';
var Whiteboard = require('./Whiteboard.js');
var Room = require('./Room.js');
var RoomCommunicator = require("../communication/RoomCommunicator.js");
var DrawCommandLogic = require("../logic/DrawCommandLogic.js");

var RoomManager = function(socketManager, userManager) {
    this._roomId = 0;
    this._rooms = {};
    this._userManager = userManager;
    this._drawCommandLogic = new DrawCommandLogic(this);
    
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
        var roomObjects = this._rooms[roomId];
        if(roomObjects) {
            socket.join(roomId);
            new RoomCommunicator(this._socketManager, socket, this._drawCommandLogic);
            roomObjects.room.connectUserToRoom(user);
        }
    },

    createNewRoom: function(creatingUser) {
        var roomId = this._getRoomId();
        var newRoom = this._setupNewRoom(roomId, creatingUser);

        this._roomId++;
        this._manageRoom(roomId, newRoom);
        return roomId;
    },

    _getRoomId: function() {
        return this._roomId;
    },

    _setupNewRoom: function(roomId, creatingUser) {
        var newWhiteboard = new Whiteboard();
        return new Room(roomId, creatingUser, newWhiteboard);
    },

    _manageRoom: function(roomId, room) {
        this._rooms[roomId] = {room: room};
    },

    getRoom: function(roomId) {
        return this._rooms[roomId].room;
    },
};

module.exports = RoomManager;