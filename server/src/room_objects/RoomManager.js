'use strict';
var Whiteboard = require('./Whiteboard.js');
var Room = require('./Room.js');
var RoomCommunicator = require("../communication/RoomCommunicator.js");
var DrawCommandLogic = require("../logic/DrawCommandLogic.js");
var ChatLogic = require("../logic/ChatLogic.js");
var Events = require("../Events.js");

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
    this._chatLogic = new ChatLogic(this);

    this._initSocketCallbacks(socketManager);

    this.createNewRoom(stubUser);
    this.createNewRoom(stubUser);
};

RoomManager.prototype = {
    _initSocketCallbacks: function(socketManager) {
        var self = this;

        socketManager.on(Events.SocketCreated, function(socket) {
            new RoomCommunicator(self._socketManager, socket, self._drawCommandLogic, self._chatLogic);

            socket.on(Events.JoinRequest, function(msgData) {
                self._userManager.findByAuthToken(msgData.authToken, function(error, user) {

                    socket.user = user;

                    self.authenticateUser(error, user, function() {
                        self.joinRoom(msgData.roomId, user, socket);
                    },
                    function() {
                        socket.emit(Events.JoinRequest, "rejected");
                    });
                });
            });

            socket.on(Events.LeaveRoom, function(msgData) {
                self.leaveRoom(msgData.roomId, socket.user, socket);
            });

            socket.on("error", function(err) {
                console.error("SocketIO error: " + err);
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

            socket.emit(Events.JoinRequest, roomId);
            socket.broadcast.to(roomId).emit(Events.RoomMessage, {
                message: user.displayName + " has joined room"
            });

            roomObject.connectUserToRoom(user);
        }
    },

    leaveRoom: function(roomId, user, socket) {
        var roomObject = this._rooms[roomId];
        if(roomObject) {
            socket.leave(roomId);

            socket.broadcast.to(roomId).emit(Events.RoomMessage, {
                message: user.displayName + " has left"
            });

            roomObject.disconnectUserFromRoom(user);
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

    getRooms: function() {
        return this._rooms;
    },

    _respondToSuccessfulCreate: function(roomId, res) {
        res.json({roomId: roomId});
    },

    getRoom: function(roomId) {
        return this._rooms[roomId];
    },
};

module.exports = RoomManager;
