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


        // TODO: finish these listens properly
        this._socket.on("leaveRoom", function() {
            self._socket.leave(self._socket.room);
            self._socket.broadcast.to(self._socket.room).emit("roomChatMessage", "User has left");
            self._socket.room = undefined;
        });

        this._socket.on("disconnect", function() {
            self._socket.leave(self._socket.room);
            self._socket.broadcast.to(self._socket.room).emit("roomChatMessage", "User has left");
            self._socket.room = undefined;
        });

        this._socket.on("chat", function(msg) {
            self._socket.broadcast.to(self._socket.room).emit("chat", msg);
        });
    },
    handleDrawCommand: function(messageData) {
        this._drawCommandLogic.handleDrawCommand(new DrawCommandMessage(this, messageData));
    },
    handleGetAllDrawCommands: function() {
        this._drawCommandLogic.handleGetAllDrawCommands(new GetAllDrawCommandsMessage(this));
    },
    getRoomId: function() {
        return this._socket.rooms[1];
    },
    sendMessage: function(messageType, messageData) {
        this._socket.broadcast.to(this._socket.room).emit(messageType, messageData);
    },
    sendMessageToSocket: function(messageType, messageData) {
        this._socket.emit(messageType, messageData);
    },
};

module.exports = RoomCommunicator;
