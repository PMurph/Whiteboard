'use strict';
var RoomFactory = require('./RoomFactory');

var RoomManager = function(socketManager, userManager) {
    this._roomFactory = new RoomFactory();
    this._rooms = {};
    this._userManager = userManager;
    this._pendingJoinRoomRequests = {};
    
    this.initSocketCallbacks(socketManager);
};

RoomManager.prototype = ({
    authenticateUserCallback: function(error, user) {
        if(error || !user || !this._pendingJoinRoomRequests[user.authToken]) {
            
        } else {
            var pendingJoinRequest = this._pendingJoinRoomRequests[user.authToken];
            this._joinRoom(pendingJoinRequest.roomId, pendingJoinRequest.socket);
            delete this._pendingJoinRoomRequests[user.authToken];
        }
    },

    _handleUnathenticatedRequest: function() {
        var i = 0;
        i++;
    },

    _joinRoom: function(roomId, socket) {
        if(this._rooms[roomId]) {
            socket.join(roomId);
        }
    },

    initSocketCallbacks: function(socketManager) {
        var self = this;
        socketManager.on("connection", function(socket) {
            socket.on("joinRequest", function(msgData) {
                self.handleJoinRequest(msgData.roomId, msgData.authToken, socket);
            });
        });
    },

    handleJoinRequest: function(roomId, authToken, socket) {
        var self = this;
        this._pendingJoinRoomRequests[authToken] = {roomId: roomId, socket: socket};
        this._userManager.findByAuthToken(authToken, function(error, user) {
            self.authenticateUserCallback(error, user);
        });
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
});

module.exports = RoomManager;