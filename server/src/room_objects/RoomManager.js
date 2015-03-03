'use strict';
var Whiteboard = require('./Whiteboard.js');
var Room = require('./Room.js');
var RoomCommunicator = require("../communication/RoomCommunicator.js");
var DrawCommandLogic = require("../logic/DrawCommandLogic.js");

var RoomManager = function(socketManager, userSession) {
    this._roomId = 0;
    this._rooms = [];
    this._socketManager = socketManager;
    this._userSession = userSession;
    this._userManager = userSession.userManager;
    this._drawCommandLogic = new DrawCommandLogic(this);

    this._initSocketCallbacks(socketManager);

    this.createNewRoom(null);
};

RoomManager.prototype = {
    _initSocketCallbacks: function(socketManager) {
        var self = this;

        // socketManager.use(function(socket, next) {
        //     var authToken = socket.request._query.authToken;
        //     self._userManager.findByAuthToken(authToken, function(error, user) {
        //         self.authenticateUser(error, user, function() {
        //             next();
        //         });
        //     });
        // });

        socketManager.on("connection", function(socket) {
            socket.on("joinRequest", function(msgData) {
                self._userManager.findByAuthToken(msgData.authToken, function(error, user) {
                    self.authenticateUser(error, user, function() {
                        self.joinRoom(msgData.roomId, user, socket);
                    },
                    function() {
                    });
                });
            });

            socket.on("draw", function(msg) {
                socket.broadcast.emit("draw", msg);
            });

            socket.on("chat", function(msg) {
                socket.broadcast.emit("chat", msg);
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
