"use strict";
var MessageFactory = require("../../src/MessageFactory.js");
var DrawCommandMessage = require("../../src/communication/objects/DrawCommandMessage.js");

describe("MessageFactory", function() {
    var TEST_ROOM_ID = 42;
    var TEST_ROOM_COMMUNICATOR = "test room communicator";
    var TEST_DRAW_COMMAND = {msgType: "draw", drawCommand: "some draw command object", roomId: TEST_ROOM_ID};
    var testMessageFactory;

    beforeEach(function(){
        testMessageFactory = new MessageFactory();
    });

    it('should respond to the wrapIncomingMessage function', function() {
        expect(testMessageFactory.wrapIncomingMessage).toBeDefined();
    });

    describe("Incoming Draw Command", function() {
        var createdMessage;

        beforeEach(function() {
            createdMessage = testMessageFactory.wrapIncomingMessage(TEST_ROOM_COMMUNICATOR, TEST_DRAW_COMMAND);
        });

        it('should return a DrawCommandMessage if a message of type draw', function() {
            expect(createdMessage instanceof DrawCommandMessage).toBe(true);
        });

        it("should return a DrawCommandMessage that returns the RoomCommunicator that was passed to wrapIncomingMessage", function() {
            expect(createdMessage.getRoomCommunicator()).toEqual(TEST_ROOM_COMMUNICATOR);
        });

        it("should return a DrawCommandMessage that returns the draw command that was contained in the draw coommand passed to wrapIncomingMessage", function() {
            expect(createdMessage.getDrawCommand()).toEqual(TEST_DRAW_COMMAND.drawCommand);
        });
    });
});