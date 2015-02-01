"use strict";
var DrawCommandLogic = function(room) {
    this._room = room;
};

DrawCommandLogic.prototype = {
    handleDrawCommand: function(drawCommandMessage) {
        this._room.handleDrawCommand(drawCommandMessage);
    },
    handleDrawResponse: function(drawCommandResponse) {
        var roomCommunicator = drawCommandResponse.getRoomCommunicator();
        roomCommunicator.sendMessage(null);
    }
};

module.exports = DrawCommandLogic;