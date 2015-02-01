"use strict";
var DRAW_MESSAGE_TYPE = "draw";

var RoomCommunicator = function(socket, drawCommandLogic, messageFactory) {
    this._socket = socket;
    this._drawCommandLogic = drawCommandLogic;
    this._messageFactory = messageFactory;

    socket.on('message', this.handleMessage);
};

RoomCommunicator.prototype = {
    handleMessage: function(messageData) {
        if(messageData.msgType === DRAW_MESSAGE_TYPE) {
            this._drawCommandLogic.handleDrawCommand(this._messageFactory.wrapIncomingMessage(this, messageData));
        }
    },
    sendMessage: function(messageData) {
        this._socket.emit(messageData);
    },
};

module.exports = RoomCommunicator;