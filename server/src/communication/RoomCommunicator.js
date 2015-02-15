"use strict";
var DrawCommandMessage = require("./objects/DrawCommandMessage.js");
var GetAllDrawCommandsMessage = require("./objects/GetAllDrawCommandsMessage.js");

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

        socket.on("getAllDrawCommands", function(messageData) {
            self.handleGetAllDrawCommands(messageData);
        });
    },
    handleDrawCommand: function(messageData) {
        this._drawCommandLogic.handleDrawCommand(new DrawCommandMessage(this, messageData));
    },
    handleGetAllDrawCommands: function(messageData) {
        this._drawCommandLogic.handleGetAllDrawCommands(new GetAllDrawCommandsMessage(this, this._roomId, messageData));
    },
    sendMessage: function(messageType, messageData) {
        this._socketManager.sockets.in(this._roomId).emit(messageType, messageData);
    },
    sendMessageToSocket: function(messageType, messageData, socket) {
        socket.emit(messageType, messageData);
    },
};

module.exports = RoomCommunicator;