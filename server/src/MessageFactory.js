var IncomingDrawCommandMessage = require("./communication/objects/IncomingDrawCommandMessage.js");

var MessageFactory = function() {
    
};

MessageFactory.prototype = {
    wrapIncomingMessage: function(incommingMessage) {
        return new IncomingDrawCommandMessage(null);
    },
};

module.exports = MessageFactory;