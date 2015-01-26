'use strict';
var Room = require('room');
var Whiteboard = require('whiteboard')

var RoomFactory = function(creatingUser) {
    "use strict"
    this.creatingUser = creatingUser;
};

RoomFactory.prototype = {
    initialize: function() {
        creatingUser: String
    },
    // Room(roomId, creatingUser, whiteboard)
    _createNewRoom: function(creatingUser) {
        this.creatingUser = creatingUser;
        this.newRoomID = _getNextRoomID();
        
        var newWhiteboard = Whiteboard();
        var newRoom = Room(newRoomID, creatingUser, newWhiteboard);

        return newRoom;
    },
    _getNextRoomID: function() {
        return 0;
    }
});

module.exports = RoomFactory;