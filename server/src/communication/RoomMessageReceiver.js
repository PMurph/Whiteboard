"use strict";

var DRAW_MESSAGE_TYPE = "draw";

var RoomMessageReceiver = function(socket, drawCommandLogic) {
    this._socket = socket;
    this._drawCommandLogic = drawCommandLogic;

    socket.on('message', this.handleMessage);
};

RoomMessageReceiver.prototype = {
    handleMessage: function(messageData) {
        if(messageData.msgType === DRAW_MESSAGE_TYPE) {
            this._drawCommandLogic.handleDrawCommand(messageData.drawCommand);
        }
    },
};

module.exports.RoomMessageReceiver = RoomMessageReceiver;