"use strict";
var DRAW_MESSAGE_TYPE = "draw";

var RoomCommunicator = function(socket, drawCommandLogic) {
    this._socket = socket;
    this._drawCommandLogic = drawCommandLogic;

    socket.on('message', this.handleMessage);
};

RoomCommunicator.prototype = {
    handleMessage: function(messageData) {
        if(messageData.msgType === DRAW_MESSAGE_TYPE) {
            this._drawCommandLogic.handleDrawCommand(messageData.drawCommand);
        }
    },
    sendMessage: function(messageData) {
        this._socket.emit(messageData);
    },
};

module.exports = RoomCommunicator;