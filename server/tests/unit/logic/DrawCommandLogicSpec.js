"use strict";
var DrawCommandLogic = require("../../../src/logic/DrawCommandLogic.js");

describe("DrawCommandLogic", function() {
    var roomManagerMock;
    var roomMock;
    var testDrawCommandLogic;

    beforeEach(function() {
        roomManagerMock = jasmine.createSpyObj('RoomManager', ['getRoom']);
        roomMock = jasmine.createSpyObj('Room', ['handleDrawCommand']);

        roomManagerMock.getRoom.and.returnValue(roomMock);
        testDrawCommandLogic = new DrawCommandLogic(roomManagerMock);
    });

    describe('handleDrawCommand', function() {
        var TEST_ROOM_ID = 45;
        var drawCommandMessageMock;

        beforeEach(function() {
            drawCommandMessageMock = jasmine.createSpyObj("DrawCommandMessage", ['handleDrawCommand', 'handleDrawResponse', 'getRoomId']);
            drawCommandMessageMock.getRoomId.and.returnValue(TEST_ROOM_ID);
            testDrawCommandLogic.handleDrawCommand(drawCommandMessageMock);
        });

        it("should call the room's handleDrawCommand function with the same drawCommandMessage if the message is valid", function() {
            expect(roomMock.handleDrawCommand).toHaveBeenCalledWith(drawCommandMessageMock);
        });

        it("should get the room from the RoomManager", function() {
            expect(roomManagerMock.getRoom).toHaveBeenCalledWith(TEST_ROOM_ID);
        });
    });

    describe('handleDrawResponse', function() {
        var TEST_MESSAGE_TYPE = "drawCommand";
        var TEST_RESPONSE_MESSAGE = {some: "test", response: "message"};
        var drawCommandResponseMock;
        var roomCommunicatorMock;

        beforeEach(function() {
            drawCommandResponseMock = jasmine.createSpyObj("DrawCommandMessage", ['getRoomCommunicator', 'createMessage']);
            roomCommunicatorMock = jasmine.createSpyObj('RoomCommunicator', ['sendMessage']);

            drawCommandResponseMock.getRoomCommunicator.and.returnValue(roomCommunicatorMock);
            drawCommandResponseMock.createMessage.and.returnValue(TEST_RESPONSE_MESSAGE);
            testDrawCommandLogic.handleDrawResponse(drawCommandResponseMock);
        });

        it("should get the DrawCommandResponse's RoomCommunicator", function() {
            expect(drawCommandResponseMock.getRoomCommunicator).toHaveBeenCalled();
        });

        it("should call the DrawCommandResponse's RoomCommunicator's sendMessage function to have been called with drawCommand message type and a response message", function() {
            expect(roomCommunicatorMock.sendMessage).toHaveBeenCalledWith(TEST_MESSAGE_TYPE, TEST_RESPONSE_MESSAGE);
        });

        it("should call the DrawCommandResponse's createResponseMessage function", function() {
            expect(drawCommandResponseMock.createMessage).toHaveBeenCalled();
        });
    });
});