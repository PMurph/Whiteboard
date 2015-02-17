"use strict";
var GetAllDrawCommandsMessage = function(roomCommunicator) {
    this._roomCommunicator = roomCommunicator;
    this._drawCommands = [];
};

GetAllDrawCommandsMessage.prototype = {
    createMessage: function() {
        return {drawCommands: this._drawCommands};
    },
    getRoomCommunicator: function() {
        return this._roomCommunicator;
    },
    getRoomId: function() {
        return this._roomCommunicator.getRoomId();
    },
    setDrawCommands: function(drawCommands) {
        this._drawCommands = drawCommands;
    },
};

module.exports = GetAllDrawCommandsMessage;