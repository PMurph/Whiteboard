'use strict';
var Whiteboard = require('./Whiteboard.js');
var Room = require('./Room.js');
var RoomCommunicator = require("../communication/RoomCommunicator.js");
var DrawCommandLogic = require("../logic/DrawCommandLogic.js");

var RoomManager = function(socketManager, userManager) {
    this._roomId = 0;
    this._rooms = {};
    this._socketManager = socketManager;
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
                    }, 
                    function(error, usser) {
                    });
                });
            });
        });
    },

    authenticateUser: function(error, user, authenticatedCallback, unauthenticatedCallback) {
        if(user && !error) {
            authenticatedCallback();
        } else {
            unauthenticatedCallback(user, error);
        }
    },

    joinRoom: function(roomId, user, socket) {
        var roomObject = this._rooms[roomId];
        if(roomObject) {
            socket.join(roomId);
            new RoomCommunicator(this._socketManager, socket, this._drawCommandLogic);
            roomObject.room.connectUserToRoom(user);
        }
    },

    createNewRoom: function(creatingUser) {
        var roomId = this._getRoomId();
        var newRoom = this._setupNewRoom(roomId.toString(), creatingUser);

        this._roomId++;
        this._manageRoom(roomId, newRoom);
        return roomId.toString();
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
    
    getCreateRouteF: function() {
        var self = this;
    
        return function(req, res) {
            var authToken = self._userManager.userSession.getRequestToken(req);
            
            self._userManager.findByAuthToken(authToken, function(error, user) {
                self.authenticateUser(error, user, function() {
                    if(req.method == "GET" || req.method == "POST") {
                        self.createNewRoom(user.id);
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(400);
                    }
                }, 
                function(error, user) {
                    res.sendStatus(400);
                });
            });
        };
    },

    getRoom: function(roomId) {
        return this._rooms[roomId].room;
    },
};

module.exports = RoomManager;