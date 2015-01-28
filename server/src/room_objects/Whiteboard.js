"use strict"

var Whiteboard = function() {
    this._drawCommands = [];
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
};

module.exports.Whiteboard = Whiteboard;