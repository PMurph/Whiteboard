"use strict";
var RoomCommunicator = function(socket, drawCommandLogic, messageFactory) {
    this._socket = socket;
    this._drawCommandLogic = drawCommandLogic;
    this._messageFactory = messageFactory;

    socket.on('drawCommand', this.handleMessage);
};

RoomCommunicator.prototype = {
    handleDrawCommand: function(messageData) {
        this._drawCommandLogic.handleDrawCommand(this._messageFactory.wrapIncomingMessage(this, messageData));
    },
    sendMessage: function(messageData) {
        this._socket.emit(messageData);
    },
};

module.exports = RoomCommunicator;