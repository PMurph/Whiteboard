"use strict";
var DrawCommandMessage = require("./communication/objects/DrawCommandMessage.js");
var DrawCommandResponse = require("./communication/objects/DrawCommandResponse.js");

var MessageFactory = function() {
    
};

MessageFactory.prototype = {
    wrapIncomingMessage: function(roomCommunicator, incommingMessage) {
        return new DrawCommandMessage(roomCommunicator, incommingMessage.drawCommand);
    },
    createResponseFromMessage: function(message) {
        var drawCommand = message.getDrawCommand();
        return new DrawCommandResponse(drawCommand.roomId, message.getRoomCommunicator(), drawCommand);
    },
};

module.exports = MessageFactory;