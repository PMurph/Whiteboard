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
        return new DrawCommandResponse(message.getRoomCommunicator(), message.getDrawCommand());
    },
};

module.exports = MessageFactory;