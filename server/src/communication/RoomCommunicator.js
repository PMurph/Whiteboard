"use strict";
var Whiteboard = require('../room_objects/Whiteboard.js');
var Chat = require('../room_objects/Chat.js');
var Room = require('../room_objects/Room.js');
var DrawCommandMessage = require("./objects/DrawCommandMessage.js");
var GetAllDrawCommandsMessage = require("./objects/GetAllDrawCommandsMessage.js");
var ChatMessage = require("./objects/ChatMessage.js");
var GetAllChatMessage = require("./objects/GetAllChatMessage.js");
var Events = require("../Events.js");

var RoomCommunicator = function(roomManager, socketManager, socket, drawCommandLogic, chatLogic) {
    this._roomManager = roomManager;
    this._socketManager = socketManager;
    this._socket = socket;
    this._drawCommandLogic = drawCommandLogic;
    this._chatLogic = chatLogic;

    this._roomId = null;
    this._user = null;

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
    },
    getRoom: function(cb) {
        var dbCB = function (error, roomDoc) {
            if(error || !roomDoc) {
                cb(error, null);
            }else{
                var whiteboard = new Whiteboard(roomDoc),
                    chat = new Chat(roomDoc),
                    room = new Room(roomDoc, whiteboard, chat); 
                cb(null, room);
            }
        };
        
        if (this._roomId) {
            this._roomManager.getRoomById(this._roomId, dbCB);
        }else{
            console.error("No room ID in Room Communictor");
            cb("No room ID in Room Communcitor", null);
        }
    },
    getRoomId: function() {
        return this._roomId;
    },
    getSocket: function() {
        return this._socket;
    },
    setUser: function(user) {
        this._user = user;
    },
    getUser: function() {
        return this._user;
    },
    setRoomId: function(roomId) {
        this._roomId = roomId;
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
    sendMessage: function(messageType, messageData) {
        this._socketManager.sockets.in(this.getRoomId()).emit(messageType, messageData);
    },
    sendMessageToSocket: function(messageType, messageData) {
        this._socket.emit(messageType, messageData);
    }
};

module.exports = RoomCommunicator;
