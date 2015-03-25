'use strict';
var RoomCommunicator = require("../communication/RoomCommunicator.js");
var DrawCommandLogic = require("../logic/DrawCommandLogic.js");
var ChatLogic = require("../logic/ChatLogic.js");
var Events = require("../Events.js");

var RoomManager = function(socketManager, userSession, db) {
    this._rooms = [];
    this._socketManager = socketManager;
    this._userSession = userSession;
    this._userManager = userSession.userManager;
    this._drawCommandLogic = new DrawCommandLogic(this);
    this._chatLogic = new ChatLogic(this);
    
    this._setupDB(db);

    this._initSocketCallbacks(socketManager);
};

RoomManager.prototype = {
    _setupDB: function(db) {
        var roomSchema = new db.Schema({
            creatingUser: String,
            name: String,
            type: String,
            allowAnon: Boolean,
            connectedUsers: [{id: String}],
            invitedUsers: [{id: String}],
            chatMessages: [{name: String, message: String}],
            drawCommands: [{
                tool: db.Schema.Types.Mixed,
                vertices: [{x: Number, y: Number}]
            }]
        },{
            id: true,
            toJSON: true
        });

        this._RoomModel = db.model('Room', roomSchema);
    },

    _handleJoinRoomRequest: function(msgData, rm) {
        var self = this;

        var socket = rm.getSocket();
        this._userManager.findByAuthToken(msgData.authToken, function(error, user) {
            self.authenticateUser(error, user, function() {
                var roomId = msgData.roomId;
                var dbCB = function(error, room) {
                    if(error || !room) {
                        socket.emit(Events.JoinRequest, "rejected: no room");
                    }else{
                        rm.setUser(user);
                        self.joinRoom(room, user, socket);
                    }
                };

                rm.setRoomId(roomId);
                rm.getRoom(dbCB);
            },
            function() {
                socket.emit(Events.JoinRequest, "rejected: not authenticated");
            });
        });

    },

    _handleLeaveRoomRequest: function(msgData, rm) {
        var self = this;

        var socket = rm.getSocket(),
            user = rm.getUser();
        var dbDB = function(error, room) {
            if(error || !room) {
                socket.emit(Events.LeaveRequest, "rejected: no room");
            }else{
                self.leaveRoom(room, user, socket);
            }

        };
        rm.getRoom(dbDB);
    },

    _initSocketCallbacks: function(socketManager) {
        var self = this;

        socketManager.on(Events.SocketCreated, function(socket) {
            var rm = new RoomCommunicator(self, self._socketManager, socket, self._drawCommandLogic, self._chatLogic);

            socket.on(Events.JoinRequest, function(msgData) {
                self._handleJoinRoomRequest(msgData, rm);
            });

            socket.on(Events.LeaveRoom, function(msgData) {
                self._handleLeaveRoomRequest(msgData, rm);
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

    joinRoom: function(room, user, socket) {
        if (room && user && socket) {
            var roomId = room.getId();
            socket.join(roomId);

            socket.emit(Events.JoinRequest, roomId);

            var dbCB = function(error, room) {
                if (!error && room) {
                    socket.broadcast.to(roomId).emit(Events.RoomMessage, {
                        message: user.displayName + " has joined room"
                    });
                }
            };

            room.connectUserToRoom(user, dbCB);
        }else{
            throw "No room or user or socket";
        }
    },

    leaveRoom: function(room, user, socket) {
        if (room && user && socket) {
            var roomId = room.getId();
            socket.leave(roomId);
            
            var dbCB = function(error, roomDoc) {
                if (!error && roomDoc) {
                    socket.broadcast.to(roomId).emit(Events.RoomMessage, {
                        message: user.displayName + " has left"
                    });
                }
            };

            room.disconnectUserFromRoom(user, dbCB);
        }
    },

    _createNewRoom: function(name, creatingUserId, type, allowAnon, cb) {
        var doc = new this._RoomModel({
            name: name,
            creatingUser: creatingUserId,
            type: type,
            allowAnon: allowAnon
        });
        doc.save(cb);
    },

    _handlePost: function(body, user, res) {
        var self = this;

        var name = body.name || "No Name",
            type = body.type || "public",
            allowAnon = body.allowAnonymous || true;

        var dbCB = function(error, room) {
            if (error || !room) {
                res.sendStatus(400);
            }else{
                var roomId = room.id;
                self._respondToSuccessfulCreate(roomId, res);
            }
        };

        this._createNewRoom(name, user.id, type, allowAnon, dbCB);
    },

    _handleAuthRequest: function(req, res, user) {
        if(req.method === "GET") {
            this._respondToGetRoomList(req.query, user, res);
        } else if(req.method === "POST") {
            this._handlePost(req.body, user, res);
        } else {
            res.sendStatus(405);
        }
    },

    getRoomRouteF: function() {
        var self = this;

        return function(req, res) {
            var authToken = self._userSession.getRequestToken(req);

            self._userManager.findByAuthToken(authToken, function(error, user) {

                self.authenticateUser(error, user, function() {
                    self._handleAuthRequest(req, res, user);
                },
                function() {
                    res.sendStatus(403);
                });
            });
        };
    },

    _respondToGetRoomList: function(query, user, res) {
        var dbCB = function(error, rooms) {
            if(error || !rooms){
                res.sendStatus(400);
            }else{
                var roomList = [];
                for(var i = 0; i < rooms.length; i++){
                    roomList[i] = {
                        _id: rooms[i].id,
                        name: rooms[i].name,
                        type: rooms[i].type
                    };
                }
                res.json(roomList);
            }
        };
        this.getRoomList(user, dbCB);
    },

    getRoomList: function(user, cb) {
        this._RoomModel.find().exec(cb);
    },

    getRooms: function() {
        return this._rooms;
    },

    _respondToSuccessfulCreate: function(roomId, res) {
        res.json({roomId: roomId});
    },

    getRoomById: function(roomId, cb) {
        this._RoomModel.findById(roomId).exec(cb);
    },
};

module.exports = RoomManager;
