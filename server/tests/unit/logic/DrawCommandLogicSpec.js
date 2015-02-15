"use strict";
var DrawCommandLogic = require("../../../src/logic/DrawCommandLogic.js");

describe("DrawCommandLogic", function() {
    var TEST_ROOM_ID = 45;
    var TEST_RESPONSE_MESSAGE = {some: "test", response: "message"};

    var roomManagerMock;
    var roomMock;
    var roomCommunicatorMock;
    var testDrawCommandLogic;

    beforeEach(function() {
        roomCommunicatorMock = jasmine.createSpyObj('RoomCommunicator', ['sendMessage', 'sendMessageToSocket']);
        roomManagerMock = jasmine.createSpyObj('RoomManager', ['getRoom']);
        roomMock = jasmine.createSpyObj('Room', ['handleDrawCommand', 'handleGetAllDrawCommands']);

        roomManagerMock.getRoom.and.returnValue(roomMock);
        testDrawCommandLogic = new DrawCommandLogic(roomManagerMock);
    });

    describe('handleDrawCommand', function() {
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
        var drawCommandResponseMock;

        beforeEach(function() {
            drawCommandResponseMock = jasmine.createSpyObj("DrawCommandMessage", ['getRoomCommunicator', 'createMessage']);

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

    describe("GetAllDrawCommands", function() {
        var getAllDrawCommandsMessageMock;

        beforeEach(function() {
            getAllDrawCommandsMessageMock = jasmine.createSpyObj('GetAllDrawCommandsMessage', ["getRoomId", "getRoomCommunicator", "createMessage", "getSocket"]);
        });

        describe("handleGetAllDrawCommands", function() {
            beforeEach(function() {
                getAllDrawCommandsMessageMock.getRoomId.and.returnValue(TEST_ROOM_ID);
                testDrawCommandLogic.handleGetAllDrawCommands(getAllDrawCommandsMessageMock);
            });

            it("should get the room from the room manager", function() {
                expect(roomManagerMock.getRoom).toHaveBeenCalledWith(TEST_ROOM_ID);
            });

            it("should call the room's handleGetAllDrawCommands function", function() {
                expect(roomMock.handleGetAllDrawCommands).toHaveBeenCalledWith(getAllDrawCommandsMessageMock, testDrawCommandLogic);
            });
        });

        describe("handleGetAllDrawCommandsResponse", function() {
            var TEST_MESSAGE_TYPE = "getAllDrawCommands";

            var socketMock;

            beforeEach(function() {
                socketMock = {};
                getAllDrawCommandsMessageMock.getSocket.and.returnValue(socketMock);
                getAllDrawCommandsMessageMock.createMessage.and.returnValue(TEST_RESPONSE_MESSAGE);
                getAllDrawCommandsMessageMock.getRoomCommunicator.and.returnValue(roomCommunicatorMock);
                testDrawCommandLogic.handleGetAllDrawCommandsResponse(getAllDrawCommandsMessageMock);
            });

            it("should get the room communicator from the message", function() {
                expect(getAllDrawCommandsMessageMock.getRoomCommunicator).toHaveBeenCalledWith();
            });

            it("should get the socket from the message", function() {
                expect(getAllDrawCommandsMessageMock.getSocket).toHaveBeenCalled();
            });

            it("should call getAllDrawCommandsMessage's createMessage function", function() {
                expect(getAllDrawCommandsMessageMock.createMessage).toHaveBeenCalled();
            });
            
            it("should call the room communicator's sendMessageToSocket function", function() {
                expect(roomCommunicatorMock.sendMessageToSocket).toHaveBeenCalledWith(TEST_MESSAGE_TYPE, TEST_RESPONSE_MESSAGE, socketMock);
            });
        });
    });
});