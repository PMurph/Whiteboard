"use strict";
var DrawCommandMessage = require("./communication/objects/DrawCommandMessage.js");

var MessageFactory = function() {
    
};

MessageFactory.prototype = {
    wrapIncomingMessage: function(incommingMessage) {
        return new DrawCommandMessage(null);
    },
};

module.exports = MessageFactory;