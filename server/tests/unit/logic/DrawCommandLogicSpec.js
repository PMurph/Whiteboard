"use strict";
var DrawCommandLogic = require("../../../src/logic/DrawCommandLogic.js");

describe("DrawCommandLogic", function() {
    var TEST_RESPONSE_MESSAGE = {some: "test", response: "message"};

    var roomMock;
    var roomCommunicatorMock;
    var testDrawCommandLogic;

    beforeEach(function() {
        roomCommunicatorMock = jasmine.createSpyObj('RoomCommunicator', ['sendMessage', 'sendMessageToSocket']);
        roomMock = jasmine.createSpyObj('Room', ['handleDrawCommand', 'handleGetAllDrawCommands']);

        testDrawCommandLogic = new DrawCommandLogic();
    });

    describe('handleDrawCommand', function() {
        var drawCommandMessageMock;

        beforeEach(function() {
            drawCommandMessageMock = jasmine.createSpyObj("DrawCommandMessage", ['handleDrawCommand', 'handleDrawResponse', 'getRoom']);
            drawCommandMessageMock.getRoom.and.callFake(function (cb) {
                cb(null, roomMock);  
            });
            testDrawCommandLogic.handleDrawCommand(drawCommandMessageMock);
        });

        it("should call the room's handleDrawCommand function with the same drawCommandMessage if the message is valid", function() {
            expect(roomMock.handleDrawCommand).toHaveBeenCalledWith(drawCommandMessageMock, testDrawCommandLogic);
        });

        it("should get the room from the RoomManager", function() {
            expect(drawCommandMessageMock.getRoom).toHaveBeenCalledWith(jasmine.any(Function));
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
            getAllDrawCommandsMessageMock = jasmine.createSpyObj('GetAllDrawCommandsMessage', ["getRoom", "getRoomCommunicator", "createMessage"]);
            getAllDrawCommandsMessageMock.getRoom.and.callFake(function (cb) {
                cb(null, roomMock);  
            });
        });

        describe("handleGetAllDrawCommands", function() {
            beforeEach(function() {
                testDrawCommandLogic.handleGetAllDrawCommands(getAllDrawCommandsMessageMock);
            });

            it("should get the room from the room manager", function() {
                expect(getAllDrawCommandsMessageMock.getRoom).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it("should call the room's handleGetAllDrawCommands function", function() {
                expect(roomMock.handleGetAllDrawCommands).toHaveBeenCalledWith(getAllDrawCommandsMessageMock, testDrawCommandLogic);
            });
        });

        describe("handleGetAllDrawCommandsResponse", function() {
            var TEST_MESSAGE_TYPE = "getAllDrawCommands";

            beforeEach(function() {
                getAllDrawCommandsMessageMock.createMessage.and.returnValue(TEST_RESPONSE_MESSAGE);
                getAllDrawCommandsMessageMock.getRoomCommunicator.and.returnValue(roomCommunicatorMock);
                testDrawCommandLogic.handleGetAllDrawCommandsResponse(getAllDrawCommandsMessageMock);
            });

            it("should get the room communicator from the message", function() {
                expect(getAllDrawCommandsMessageMock.getRoomCommunicator).toHaveBeenCalledWith();
            });

            it("should call getAllDrawCommandsMessage's createMessage function", function() {
                expect(getAllDrawCommandsMessageMock.createMessage).toHaveBeenCalled();
            });
            
            it("should call the room communicator's sendMessageToSocket function", function() {
                expect(roomCommunicatorMock.sendMessageToSocket).toHaveBeenCalledWith(TEST_MESSAGE_TYPE, TEST_RESPONSE_MESSAGE);
            });
        });
    });
});
