"use strict";
var IncomingDrawCommandMessage = require("../../../src/communication/objects/IncomingDrawCommandMessage.js");

describe("IncomingDrawCommandMessage", function() {
    var testDrawCommand;
    var testRoomCommunicator;
    var testIncomingDrawCommandMessage;

    beforeEach(function() {
        testDrawCommand = {some: "test", draw: "command"};
        testRoomCommunicator = "test object";

        testIncomingDrawCommandMessage = new IncomingDrawCommandMessage(testRoomCommunicator, testDrawCommand);
    });

    it("should return the testDrawCommand", function() {
        expect(testIncomingDrawCommandMessage.getDrawCommand()).toEqual(testDrawCommand);
    });

    it("should return the RoomCommunicator object it was created with", function() {
        expect(testIncomingDrawCommandMessage.getRoomCommunicator()).toEqual(testRoomCommunicator);
    });
});