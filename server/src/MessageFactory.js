"use strict";
var DrawCommandMessage = require("./communication/objects/DrawCommandMessage.js");

var MessageFactory = function() {
    
};

MessageFactory.prototype = {
    wrapIncomingMessage: function(roomCommunicator, incommingMessage) {
        return new DrawCommandMessage(roomCommunicator, incommingMessage.drawCommand);
    },
};

module.exports = MessageFactory;