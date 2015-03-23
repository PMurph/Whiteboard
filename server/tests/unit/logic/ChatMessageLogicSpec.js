"use strict";
var ChatLogic = require("../../../src/logic/ChatLogic.js");

describe("ChatLogic", function() {
    var TEST_ROOM_ID = 45;
    var TEST_RESPONSE_MESSAGE = {some: "test", response: "message"};

    var roomManagerMock;
    var roomMock;
    var roomCommunicatorMock;
    var testChatLogic;

    beforeEach(function() {
        roomCommunicatorMock = jasmine.createSpyObj('RoomCommunicator', ['sendMessage', 'sendMessageToSocket']);
        roomManagerMock = jasmine.createSpyObj('RoomManager', ['getRoom']);
        roomMock = jasmine.createSpyObj('Room', ['handleChatMessage', 'handleGetAllChatMessages']);

        roomManagerMock.getRoom.and.returnValue(roomMock);
        testChatLogic = new ChatLogic(roomManagerMock);
    });

    describe('handleChatMessage', function() {
        var chatMessageMock;

        beforeEach(function() {
            chatMessageMock = jasmine.createSpyObj("ChatMessage", ['handleChatMessage', 'handleChatResponse', 'getRoomId']);
            chatMessageMock.getRoomId.and.returnValue(TEST_ROOM_ID);
            testChatLogic.handleChatMessage(chatMessageMock);
        });

        it("should call the room's handleChat function with the same chatMessage if the message is valid", function() {
            expect(roomMock.handleChatMessage).toHaveBeenCalledWith(chatMessageMock, testChatLogic);
        });

        it("should get the room from the RoomManager", function() {
            expect(roomManagerMock.getRoom).toHaveBeenCalledWith(TEST_ROOM_ID);
        });
    });

    describe('handleChatResponse', function() {
        var TEST_MESSAGE_TYPE = "chatMessage";
        var chatResponseMock;

        beforeEach(function() {
            chatResponseMock = jasmine.createSpyObj("chatMessage", ['getRoomCommunicator', 'createMessage']);

            chatResponseMock.getRoomCommunicator.and.returnValue(roomCommunicatorMock);
            chatResponseMock.createMessage.and.returnValue(TEST_RESPONSE_MESSAGE);
            testChatLogic.handleChatResponse(chatResponseMock);
        });

        it("should get the ChatResponse's RoomCommunicator", function() {
            expect(chatResponseMock.getRoomCommunicator).toHaveBeenCalled();
        });

        it("should call the ChatResponse's RoomCommunicator's sendMessage function to have been called with chat message type and a response message", function() {
            expect(roomCommunicatorMock.sendMessage).toHaveBeenCalledWith(TEST_MESSAGE_TYPE, TEST_RESPONSE_MESSAGE);
        });

        it("should call the ChatResponse's createResponseMessage function", function() {
            expect(chatResponseMock.createMessage).toHaveBeenCalled();
        });
    });

    describe("GetAllChat", function() {
        var getAllChatMock;

        beforeEach(function() {
            getAllChatMock = jasmine.createSpyObj('GetAllChatMessage', ["getRoomId", "getRoomCommunicator", "createMessage"]);
        });

        describe("handleGetAllChat", function() {
            beforeEach(function() {
                getAllChatMock.getRoomId.and.returnValue(TEST_ROOM_ID);
                testChatLogic.handleGetAllChatMessages(getAllChatMock);
            });

            it("should get the room from the room manager", function() {
                expect(roomManagerMock.getRoom).toHaveBeenCalledWith(TEST_ROOM_ID);
            });

            it("should call the room's handleGetAllChat function", function() {
                expect(roomMock.handleGetAllChatMessages).toHaveBeenCalledWith(getAllChatMock, testChatLogic);
            });
        });

        describe("handleGetAllChatMessagesResponse", function() {
            var TEST_MESSAGE_TYPE = "getAllChat";

            beforeEach(function() {
                getAllChatMock.createMessage.and.returnValue(TEST_RESPONSE_MESSAGE);
                getAllChatMock.getRoomCommunicator.and.returnValue(roomCommunicatorMock);
                testChatLogic.handleGetAllChatMessagesResponse(getAllChatMock);
            });

            it("should get the room communicator from the message", function() {
                expect(getAllChatMock.getRoomCommunicator).toHaveBeenCalledWith();
            });

            it("should call getAllChat's createMessage function", function() {
                expect(getAllChatMock.createMessage).toHaveBeenCalled();
            });

            it("should call the room communicator's sendMessageToSocket function", function() {
                expect(roomCommunicatorMock.sendMessageToSocket).toHaveBeenCalledWith(TEST_MESSAGE_TYPE, TEST_RESPONSE_MESSAGE);
            });
        });
    });
});
