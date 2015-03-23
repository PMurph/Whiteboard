"use strict";
var Events = require("../Events.js");

var ChatMessageLogic = function(roomManager) {
    this._roomManager = roomManager;
};

ChatMessageLogic.prototype = {
    handleChatMessage: function(chatMessage) {
        var room = this._roomManager.getRoom(chatMessage.getRoomId());
        room.handleChatMessage(chatMessage, this);
    },
    handleChatResponse: function(chatMessageResponse) {
        var roomCommunicator = chatMessageResponse.getRoomCommunicator();
        var responseMessage = chatMessageResponse.createMessage();
        roomCommunicator.sendMessage(Events.ChatMessage, responseMessage);
    },
    handleGetAllChatMessages: function(getAllChatMessages) {
        var room = this._roomManager.getRoom(getAllChatMessages.getRoomId());
        room.handleGetAllChatMessages(getAllChatMessages, this);
    },
    handleGetAllChatMessagesResponse: function(getAllChatMessagesResponse) {
        var roomCommunicator = getAllChatMessagesResponse.getRoomCommunicator();
        var responseMessage = getAllChatMessagesResponse.createMessage();
        roomCommunicator.sendMessageToSocket(Events.GetAllChat, responseMessage);
    },
};

module.exports = ChatMessageLogic;
