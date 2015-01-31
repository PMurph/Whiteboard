"use strict";

var DrawCommandWrapper = function(drawCommand) {
    this._drawCommand = drawCommand;
};

DrawCommandWrapper.prototype = {
    getDrawCommand: function() {
        return this._drawCommand;
    },
};

module.exports = DrawCommandWrapper;