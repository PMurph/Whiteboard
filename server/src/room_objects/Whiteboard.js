"use strict";

var Whiteboard = function(roomDoc) {
    this._roomDoc = roomDoc;
};

Whiteboard.prototype = {
    addDrawCommand: function(drawCommand, cb) {
        this._roomDoc.drawCommands.push(drawCommand);

        this._roomDoc.save(cb);
    },

    getAllDrawCommands: function() {
        return this._roomDoc.drawCommands.toObject();
    },

    getNumDrawCommandsSeen: function() {
        return this._roomDoc.drawCommands.length;
    },

    getLastDrawCommands: function(numCommands) {
        return this._drawCommands.slice(this._drawCommands.length - numCommands, this._drawCommands.length);
    }
};

module.exports = Whiteboard;
