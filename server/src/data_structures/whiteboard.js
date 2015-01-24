var Whiteboard = function() {
    "use strict";
    this._drawCommands = [];
};

Whiteboard.prototype = {
    getAllDrawCommands: function() {
        return this._drawCommands;
    },

    getLastDrawCommands: function(numCommands) {
        return this._drawCommands.slice(this._drawCommands.length - numCommands, this._drawCommands.length);
    },

    addDrawCommand: function(drawCommand) {
        this._drawCommands.push(drawCommand);
    },
};

module.exports.Whiteboard = Whiteboard;