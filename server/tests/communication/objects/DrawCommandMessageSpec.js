"use strict";
var DrawCommandMessage = require("../../../src/communication/objects/DrawCommandMessage.js");

describe("DrawCommandMessage", function() {
    var TEST_ROOM_ID = 45;

    var testDrawCommand;
    var testRoomCommunicator;
    var testDrawCommandMessage;

    beforeEach(function() {
        testDrawCommand = {roomId: TEST_ROOM_ID, some: "test", draw: "command"};
        testRoomCommunicator = "test object";

        testDrawCommandMessage = new DrawCommandMessage(testRoomCommunicator, testDrawCommand);
    });

    it("should return the testDrawCommand", function() {
        expect(testDrawCommandMessage.getDrawCommand()).toEqual(testDrawCommand);
    });

    it("should return the RoomCommunicator object it was created with", function() {
        expect(testDrawCommandMessage.getRoomCommunicator()).toEqual(testRoomCommunicator);
    });

    it('should return the RoomId of the drawCommand', function() {
        expect(testDrawCommandMessage.getRoomId()).toEqual(TEST_ROOM_ID);
    });
});