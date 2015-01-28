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
    _createNewRoom: function(creatingUser) {
        this.creatingUser = creatingUser;
        this.newRoomID = _getNextRoomID();
        
        var newWhiteboard = new Whiteboard();
        var newRoom = new Room(newRoomID, creatingUser, newWhiteboard);

        return newRoom;
    },
    _getNextRoomID: function() {
        return 0;
    }
});

module.exports = RoomFactory;