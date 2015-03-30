"use strict";
var Events = require("../Events.js");

var ChatMessageLogic = function() {
};

ChatMessageLogic.prototype = {
    handleChatMessage: function(chatMessage) {
        var self = this;

        var dbCB = function (error, room) {
            if (error || !room) {
                console.error("No room found");
            }else{
                room.handleChatMessage(chatMessage, self);
            }
        };
        chatMessage.getRoom(dbCB);
    },
    handleChatResponse: function(chatMessageResponse) {
        var roomCommunicator = chatMessageResponse.getRoomCommunicator();
        var responseMessage = chatMessageResponse.createMessage();
        roomCommunicator.sendMessage(Events.ChatMessage, responseMessage);
    },
    handleGetAllChatMessages: function(getAllChatMessages) {
        var self = this;

        var dbCB = function (error, room) {
            if (error || !room) {
                console.error("No room found");
            }else{
                room.handleGetAllChatMessages(getAllChatMessages, self);
            }
        };
        getAllChatMessages.getRoom(dbCB);
    },
    handleGetAllChatMessagesResponse: function(getAllChatMessagesResponse) {
        var roomCommunicator = getAllChatMessagesResponse.getRoomCommunicator();
        var responseMessage = getAllChatMessagesResponse.createMessage();
        roomCommunicator.sendMessageToSocket(Events.GetAllChat, responseMessage);
    },
};

module.exports = ChatMessageLogic;
