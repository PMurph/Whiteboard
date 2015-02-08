"use strict";
var RoomCommunicator = function(socketManager, roomId, drawCommandLogic, messageFactory) {
    this._socketManager = socketManager;
    this._roomId = roomId;
    this._drawCommandLogic = drawCommandLogic;
    this._messageFactory = messageFactory;
};

RoomCommunicator.prototype = {
    addSocket: function(socket) {
        var self = this;
        socket.join(this._roomId);
        
        socket.on("drawCommand", function(messageData) {
            self.handleDrawCommand(messageData);
        });
    },
    handleDrawCommand: function(messageData) {
        this._drawCommandLogic.handleDrawCommand(this._messageFactory.wrapIncomingMessage(this, messageData));
    },
    sendMessage: function(messageType, messageData) {
        this._socketManager.sockets.in(this._roomId).emit(messageType, messageData);
    },
};

module.exports = RoomCommunicator;