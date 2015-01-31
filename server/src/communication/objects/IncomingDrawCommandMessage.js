"use strict";

var IncomingDrawCommandMessage = function(roomCommunicator, drawCommand) {
    this._drawCommand = drawCommand;
    this._roomCommunicator = roomCommunicator;
};

IncomingDrawCommandMessage.prototype = {
    getDrawCommand: function() {
        return this._drawCommand;
    },

    getRoomCommunicator: function() {
        return this._roomCommunicator;
    }
};

module.exports = IncomingDrawCommandMessage;