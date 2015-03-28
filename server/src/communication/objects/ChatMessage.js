"use strict";
var ChatMessage = function(roomCommunicator, chatMessage) {
    this._roomCommunicator = roomCommunicator;
    this._chatMessage = this._cleanMessageBody(chatMessage);
    this._chatOrder = -1;
};

ChatMessage.prototype = {
    _cleanMessageBody: function(chatMessage) {
        chatMessage.message = chatMessage.message.replace(/>/g, "&gt;").replace(/</g, "&lt;");
        return chatMessage;
    },
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
    getRoom: function(cb) {
        this._roomCommunicator.getRoom(cb);
    },
    getChatOrder: function() {
        return this._chatOrder;
    },
    setChatOrder: function(chatOrder) {
        this._chatOrder =  chatOrder;
    },
};

module.exports = ChatMessage;
