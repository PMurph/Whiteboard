"use strict";
var GetAllDrawCommandsMessage = require("../../../../src/communication/objects/GetAllDrawCommandsMessage.js");

describe("GetAllDrawCommandsMessage", function() {
    var TEST_ROOM_ID = 42;

    var testGetAllDrawCommandsMessage;
    var roomCommunicatorMock;

    beforeEach(function() {
        roomCommunicatorMock = jasmine.createSpyObj("RoomCommunicator", ["getRoomId"]);
        roomCommunicatorMock.getRoomId.and.returnValue(TEST_ROOM_ID);
        testGetAllDrawCommandsMessage = new GetAllDrawCommandsMessage(roomCommunicatorMock);
    });

    it("should return the room id it was created with", function() {
        expect(testGetAllDrawCommandsMessage.getRoomId()).toEqual(TEST_ROOM_ID);
    });

    it("should return the room communicator it was created with", function() {
        expect(testGetAllDrawCommandsMessage.getRoomCommunicator()).toEqual(roomCommunicatorMock);
    });

    describe("create message", function() {
        var TEST_DRAW_COMMANDS = ["test1", "test2"];

        it("should return a message containing an empty list of draw commands", function() {
            expect(testGetAllDrawCommandsMessage.createMessage().drawCommands).toEqual([]);
        });

        it("should return a message containing the list of draw commands that have been set", function() {
            testGetAllDrawCommandsMessage.setDrawCommands(TEST_DRAW_COMMANDS);
            expect(testGetAllDrawCommandsMessage.createMessage().drawCommands).toEqual(TEST_DRAW_COMMANDS);
        });
    });
});