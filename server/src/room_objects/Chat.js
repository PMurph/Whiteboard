"use strict";

var Chat = function(roomDoc) {
    this._roomDoc = roomDoc;
};

Chat.prototype = {
    addChat: function(chat, cb) {
        this._roomDoc.chatMessages.push(chat);

        this._roomDoc.save(cb);
    },

    getAllChat: function() {
        return this._roomDoc.chatMessages.toObject();
    },

    getNumChatSeen: function() {
        return this._roomDoc.chatMessages.length;
    },

    getLastChat: function(numCommands) {
        return this._chat.slice(this._chat.length - numCommands, this._chat.length);
    }
};

module.exports = Chat;
