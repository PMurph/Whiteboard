"use strict";
var DrawCommandMessage = function(roomCommunicator, drawCommand) {
    this._roomCommunicator = roomCommunicator;
    this._drawCommand = drawCommand;
};

DrawCommandMessage.prototype = {
    getDrawCommand: function() {
        return this._drawCommand;
    },
    getRoomCommunicator: function() {
        return this._roomCommunicator;
    },
    getRoomId: function() {
        return this._drawCommand.roomId;
    },
};

module.exports = DrawCommandMessage;