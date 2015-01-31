var MessageFactory = require("../src/MessageFactory.js");
var IncomingDrawCommandMessage = require("../src/communication/objects/IncomingDrawCommandMessage.js");

describe("MessageFactory", function() {
    var testMessageFactory;

    beforeEach(function(){
        testMessageFactory = new MessageFactory();
    });

    it('should respond to the wrapIncomingMessage function', function() {
        expect(testMessageFactory.wrapIncomingMessage).toBeDefined();
    });

    describe("Incoming Draw Command", function() {
        it('should return a IncomingDrawCommandMessage if a message of type draw', function() {
            var TEST_DRAW_COMMAND = {msgType: "draw"};
            var created_message = testMessageFactory.wrapIncomingMessage(TEST_DRAW_COMMAND);

            expect(created_message instanceof IncomingDrawCommandMessage).toBe(true);
        });
    });
});