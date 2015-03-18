"use strict";
var GetAllChatMessage = function(roomCommunicator) {
    this._roomCommunicator = roomCommunicator;
    this._chatMessages = [];
};

GetAllChatMessage.prototype = {
    createMessage: function() {
        return {chatMessages: this._chatMessages};
    },
    getRoomCommunicator: function() {
        return this._roomCommunicator;
    },
    getRoomId: function() {
        return this._roomCommunicator.getRoomId();
    },
    setChatMessages: function(chatMessages) {
        this._chatMessages = chatMessages;
    },
};

module.exports = GetAllChatMessage;
