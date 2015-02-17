"use strict";
var DrawCommandMessage = require("./objects/DrawCommandMessage.js");
var GetAllDrawCommandsMessage = require("./objects/GetAllDrawCommandsMessage.js");

var RoomCommunicator = function(socketManager, socket, drawCommandLogic) {
    this._socketManager = socketManager;
    this._socket = socket;
    this._drawCommandLogic = drawCommandLogic;

    this._initializeEvents();
};

RoomCommunicator.prototype = {
    _initializeEvents: function() {
        var self = this;
        this._socket.on("drawCommand", function(messageData) {
            self.handleDrawCommand(messageData);
        });

        this._socket.on("getAllDrawCommands", function() {
            self.handleGetAllDrawCommands();
        });
    },
    handleDrawCommand: function(messageData) {
        this._drawCommandLogic.handleDrawCommand(new DrawCommandMessage(this, this._socket.rooms()[0], messageData));
    },
    handleGetAllDrawCommands: function() {
        this._drawCommandLogic.handleGetAllDrawCommands(new GetAllDrawCommandsMessage(this, this._socket.rooms()[0]));
    },
    sendMessage: function(messageType, messageData) {
        this._socketManager.sockets.in(this._socket.rooms()[0]).emit(messageType, messageData);
    },
    sendMessageToSocket: function(messageType, messageData) {
        this._socket.emit(messageType, messageData);
    },
};

module.exports = RoomCommunicator;