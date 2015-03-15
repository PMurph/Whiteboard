'use strict';
var Whiteboard = require('./Whiteboard.js');
var Room = require('./Room.js');
var RoomCommunicator = require("../communication/RoomCommunicator.js");
var DrawCommandLogic = require("../logic/DrawCommandLogic.js");

var stubUser = {
    id: 1,
    name: "Precreated room"
};

var RoomManager = function(socketManager, userSession) {
    this._roomId = 0;
    this._rooms = [];
    this._socketManager = socketManager;
    this._userSession = userSession;
    this._userManager = userSession.userManager;
    this._drawCommandLogic = new DrawCommandLogic(this);

    this._initSocketCallbacks(socketManager);

    this.createNewRoom(stubUser);
    this.createNewRoom(stubUser);
};

RoomManager.prototype = {
    _initSocketCallbacks: function(socketManager) {
        var self = this;

        socketManager.on("connection", function(socket) {
            socket.on("joinRequest", function(msgData) {
                self._userManager.findByAuthToken(msgData.authToken, function(error, userAuthToken) {
                    self.authenticateUser(error, userAuthToken, function() {
                        self.joinRoom(msgData.roomId, userAuthToken, socket);
                    },
                    function() {
                        socket.emit("joined", "rejected");
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

            socket.emit('joined', "You've joined room " + roomId);
            socket.broadcast.to(roomId).emit("roomChatMessage", "User has joined room" + roomId);

            new RoomCommunicator(this._socketManager, socket, this._drawCommandLogic);
            roomObject.connectUserToRoom(user);
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
        this._rooms[roomId] = room;
    },

    getRoomRouteF: function() {
        var self = this;

        return function(req, res) {
            var authToken = self._userSession.getRequestToken(req);

            if(req.method === "GET") {
                self._respondToGetRoomList(res);
            } else if(req.method === "POST") {
                self._userManager.findByAuthToken(authToken, function(error, user) {
                    self.authenticateUser(error, user, function() {
                        var roomId = 0;
                        roomId = self.createNewRoom(user.id);
                        self._respondToSuccessfulCreate(roomId, res);
                    },
                    function() {
                        res.sendStatus(400);
                    });
                });
            } else {
                res.sendStatus(400);
            }
        };
    },

    _respondToGetRoomList: function(res) {
        res.json(this.getRoomList());
    },

    getRoomList: function() {
        var out = new Array(this._rooms.length);
        for (var i = 0; i < this._rooms.length; i++) {
            var r = this._rooms[i];
            if (r) {
                out[i] = {
                    _id: r.getId()
                };
            }
        }
        return out;
    },

    _respondToSuccessfulCreate: function(roomId, res) {
        res.json({roomId: roomId});
    },

    getRoom: function(roomId) {
        return this._rooms[roomId];
    },
};

module.exports = RoomManager;
