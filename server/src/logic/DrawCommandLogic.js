"use strict";
var DrawCommandLogic = function(room) {
    this._room = room;
};

DrawCommandLogic.prototype = {
    handleDrawCommand: function(drawCommandWrapper) {
        this._room.handleDrawCommand(drawCommandWrapper);
    },
};

module.exports.DrawCommandLogic = DrawCommandLogic;