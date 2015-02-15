"use strict";
var GetAllDrawCommandsMessage = function(roomCommunicator, roomId, socket) {
    this._roomCommunicator = roomCommunicator;
    this._roomId = roomId;
    this._drawCommands = [];
    this._socket = socket;
};

GetAllDrawCommandsMessage.prototype = {
    createMessage: function() {
        return {roomId: this._roomId, drawCommands: this._drawCommands};
    },
    getRoomCommunicator: function() {
        return this._roomCommunicator;
    },
    getRoomId: function() {
        return this._roomId;
    },
    getSocket: function() {
        return this._socket;
    },
    setDrawCommands: function(drawCommands) {
        this._drawCommands = drawCommands;
    },
};

module.exports = GetAllDrawCommandsMessage;