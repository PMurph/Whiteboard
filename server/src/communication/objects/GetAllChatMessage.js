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
    getRoom: function(cb) {
        this._roomCommunicator.getRoom(cb);
    },
    setChatMessages: function(chatMessages) {
        this._chatMessages = chatMessages;
    },
};

module.exports = GetAllChatMessage;
