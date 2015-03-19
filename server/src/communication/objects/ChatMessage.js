"use strict";
var ChatMessage = function(roomCommunicator, chatMessage) {
    this._roomCommunicator = roomCommunicator;
    this._chatMessage = chatMessage;
    this._chatOrder = -1;
};

ChatMessage.prototype = {
    createMessage: function() {
        return {chatMessage: this._chatMessage, chatOrder: this._chatOrder};
    },
    getChatMessage: function() {
        return this._chatMessage;
    },
    getRoomCommunicator: function() {
        return this._roomCommunicator;
    },
    getRoomId: function() {
        return this._roomCommunicator.getRoomId();
    },
    getChatOrder: function() {
        return this._chatOrder;
    },
    setChatOrder: function(chatOrder) {
        this._chatOrder =  chatOrder;
    },
};

module.exports = ChatMessage;
