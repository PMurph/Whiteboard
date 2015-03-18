"use strict";

var Whiteboard = function() {
    this._drawCommands = [];
    this._chat = [];
};

Whiteboard.prototype = {
    addDrawCommand: function(drawCommand) {
        this._drawCommands.push(drawCommand);
    },

    getAllDrawCommands: function() {
        return this._drawCommands;
    },

    getNumDrawCommandsSeen: function() {
        return this._drawCommands.length;
    },

    getLastDrawCommands: function(numCommands) {
        return this._drawCommands.slice(this._drawCommands.length - numCommands, this._drawCommands.length);
    },

    addChat: function(chat) {
        this._chat.push(chat);
    },

    getAllChat: function() {
        return this._chat;
    },

    getNumChatSeen: function() {
        return this._chat.length;
    },

    getLastChat: function(numCommands) {
        return this._chat.slice(this._chat.length - numCommands, this._chat.length);
    }
};

module.exports = Whiteboard;
