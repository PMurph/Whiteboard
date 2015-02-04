"use strict";
var DrawCommandMessage = require("../../../../src/communication/objects/DrawCommandMessage.js");

describe("DrawCommandMessage", function() {
    var TEST_ROOM_ID = 45;
    var TEST_DRAW_ORDER_NUMBER = 42;

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

    it('should return -1 if the drawOrderNumber has not been set', function() {
        expect(testDrawCommandMessage.getDrawOrder()).toEqual(-1);
    });

    it('should return the drawOrderNumber that has been set', function() {
        testDrawCommandMessage.setDrawOrder(TEST_DRAW_ORDER_NUMBER);
        expect(testDrawCommandMessage.getDrawOrder()).toEqual(TEST_DRAW_ORDER_NUMBER);
    });

    describe("creating message to send to client", function() {
        var createdMessage;

        beforeEach(function() {
            testDrawCommandMessage.setDrawOrder(TEST_DRAW_ORDER_NUMBER);
            createdMessage = testDrawCommandMessage.createMessage();
        });

        it('should create a dictionary containing a key with the draw command as the value', function() {
            expect(createdMessage.drawCommand).toEqual(testDrawCommand);
        });

        it('should create a dictionary containing a key with the draw order as the value', function() {
            expect(createdMessage.drawOrder).toEqual(TEST_DRAW_ORDER_NUMBER);
        });
    });
});