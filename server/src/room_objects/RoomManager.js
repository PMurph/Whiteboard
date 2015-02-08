'use strict';
var RoomFactory = require('./RoomFactory');

var RoomManager = function(socketManager) {
    this.roomID = 0;
    this.roomFactory = new RoomFactory();
    this.rooms = {};
    
    this.initSocketCallbacks(socketManager);
};

RoomManager.prototype = ({
    initSocketCallbacks: function(socketManager) {
        var self = this;
        socketManager.on("connection", function(socket) {
            socket.on("joinRequest", function(msgData) {
                self.joinRoom(msgData.roomdId, socket);
            });
        });
    },

    createNewRoom: function(creatingUser) {
        var room = this.roomFactory.createNewRoom(creatingUser);
        var roomId = room.getId();
        this.rooms[roomId] = room;
        return roomId;
    },

    getRoom: function(roomId) {
        return this.rooms[roomId];
    },

    joinRoom: function(roomId, socket) {
        socket.join(roomId);
    },
});

module.exports = RoomManager;