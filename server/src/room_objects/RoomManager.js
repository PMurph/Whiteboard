'use strict';
var RoomFactory = require('RoomFactory')

var RoomManager = function() {
	this.roomFactory = new RoomFactory();
};

RoomManager.prototype = ({
    initialize: function() {
        this.roomID = 0;
    },

    post: function() {

    },

    get: function() {

    },

    createNewRoom: function(creatingUser) {
    	this.roomFactory.createNewRoom(creatingUser);
    },

});

module.exports = RoomManager;