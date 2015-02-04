"use strict";
var RoomCommunicator = function(roomId, socket, drawCommandLogic, messageFactory) {
    this._roomId = roomId;
    this._socket = socket;
    this._drawCommandLogic = drawCommandLogic;
    this._messageFactory = messageFactory;

    socket.join(roomId);
    socket.on('drawCommand', this.handleMessage);
};

RoomCommunicator.prototype = {
    handleDrawCommand: function(messageData) {
        this._drawCommandLogic.handleDrawCommand(this._messageFactory.wrapIncomingMessage(this, messageData));
    },
    sendMessage: function(messageType, messageData) {
        this._socket.emit(messageType, messageData);
    },
};

module.exports = RoomCommunicator;