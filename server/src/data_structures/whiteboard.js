var Whiteboard = function() {
    "use strict";
    var drawCommands = [];

    this.getAllDrawCommands = function() {
        return drawCommands;
    }

    this.getLastDrawCommands = function(numCommands) {
        return drawCommands.slice(drawCommands.length - numCommands, drawCommands.length);
    }

    this.addDrawCommand = function(drawCommand) {
        drawCommands.push(drawCommand);
    }
}

module.exports.Whiteboard = Whiteboard;