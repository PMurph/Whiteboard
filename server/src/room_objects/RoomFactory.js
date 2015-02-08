'use strict';
var Room = require('./Room');
var Whiteboard = require('./Whiteboard');

var RoomFactory = function() {
    this.roomID = 0;
};

RoomFactory.prototype = ({
    getNextRoomID: function() {
        this.roomID = this.roomID + 1;
        return this.roomID;
    },
    createNewRoom: function(creatingUser) {
        var newRoomID = this.getNextRoomID();
        var newWhiteboard = new Whiteboard();
        var newRoom = new Room(newRoomID, creatingUser, newWhiteboard);

        return newRoom;
    }
});

module.exports = RoomFactory;
