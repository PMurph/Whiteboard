"use strict";
var IncomingDrawCommandLogic = function(room) {
    this._room = room;
};

IncomingDrawCommandLogic.prototype = {
    handleDrawCommand: function(drawCommandWrapper) {
        this._room.handleDrawCommand(drawCommandWrapper);
    },
};

module.exports = IncomingDrawCommandLogic;