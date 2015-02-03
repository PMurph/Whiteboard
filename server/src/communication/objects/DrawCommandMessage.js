"use strict";
var DrawCommandMessage = function(roomCommunicator, drawCommand) {
    this._roomCommunicator = roomCommunicator;
    this._drawCommand = drawCommand;
    this._drawOrder = -1;
};

DrawCommandMessage.prototype = {
    createMessage: function() {
        return {drawCommand: this._drawCommand, drawOrder: this._drawOrder};
    },
    getDrawCommand: function() {
        return this._drawCommand;
    },
    getRoomCommunicator: function() {
        return this._roomCommunicator;
    },
    getRoomId: function() {
        return this._drawCommand.roomId;
    },
    getDrawOrder: function() {
        return this._drawOrder;
    },
    setDrawOrder: function(drawOrder) {
        this._drawOrder =  drawOrder;
    },
};

module.exports = DrawCommandMessage;