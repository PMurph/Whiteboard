"use strict";
var DrawCommandMessage = require("./objects/DrawCommandMessage.js");
var GetAllDrawCommandsMessage = require("./objects/GetAllDrawCommandsMessage.js");
var ChatMessage = require("./objects/ChatMessage.js");
var GetAllChatMessage = require("./objects/GetAllChatMessage.js");
var Events = require("../Events.js");

var RoomCommunicator = function(socketManager, socket, drawCommandLogic, chatLogic) {
    this._socketManager = socketManager;
    this._socket = socket;
    this._drawCommandLogic = drawCommandLogic;
    this._chatLogic = chatLogic;

    this._initializeEvents();
};

RoomCommunicator.prototype = {
    _initializeEvents: function() {
        var self = this;
        this._socket.on(Events.DrawCommand, function(messageData) {
            self.handleDrawCommand(messageData);
        });

        this._socket.on(Events.GetAllDrawCommands, function() {
            self.handleGetAllDrawCommands();
        });

        this._socket.on(Events.ChatMessage, function(messageData) {
            self.handleChatMessage(messageData);
        });

        this._socket.on(Events.GetAllChat, function() {
            self.handleGetAllChat();
        });

        this._socket.on(Events.LeaveRoom, function() {
            self._socket.leave(self.getRoomId());
            self._socket.broadcast.to(self.getRoomId()).emit("roomChatMessage", "User has left");
        });

        this._socket.on(Events.SocketDestroyed, function() {
            self._socket.leave(self.getRoomId());
            self._socket.broadcast.to(self.getRoomId()).emit("roomChatMessage", "User has left");
        });
    },
    handleDrawCommand: function(messageData) {
        this._drawCommandLogic.handleDrawCommand(new DrawCommandMessage(this, messageData));
    },
    handleGetAllDrawCommands: function() {
        this._drawCommandLogic.handleGetAllDrawCommands(new GetAllDrawCommandsMessage(this));
    },
    handleChatMessage: function(messageData) {
        this._chatLogic.handleChatMessage(new ChatMessage(this, messageData));
    },
    handleGetAllChat: function() {
        this._chatLogic.handleGetAllChatMessages(new GetAllChatMessage(this));
    },
    getRoomId: function() {
        return this._socket.rooms[1];
    },
    sendMessage: function(messageType, messageData) {
        this._socketManager.sockets.in(this.getRoomId()).emit(messageType, messageData);
    },
    sendMessageToSocket: function(messageType, messageData) {
        this._socket.emit(messageType, messageData);
    }
};

module.exports = RoomCommunicator;
