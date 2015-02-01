"use strict";
var DrawCommandMessage = require("../../../src/communication/objects/DrawCommandMessage.js");

describe("DrawCommandMessage", function() {
    var testDrawCommand;
    var testRoomCommunicator;
    var testDrawCommandMessage;

    beforeEach(function() {
        testDrawCommand = {some: "test", draw: "command"};
        testRoomCommunicator = "test object";

        testDrawCommandMessage = new DrawCommandMessage(testRoomCommunicator, testDrawCommand);
    });

    it("should return the testDrawCommand", function() {
        expect(testDrawCommandMessage.getDrawCommand()).toEqual(testDrawCommand);
    });

    it("should return the RoomCommunicator object it was created with", function() {
        expect(testDrawCommandMessage.getRoomCommunicator()).toEqual(testRoomCommunicator);
    });
});