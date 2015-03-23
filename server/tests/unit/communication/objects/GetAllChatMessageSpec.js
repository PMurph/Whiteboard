"use strict";
var GetAllChatMessage = require("../../../../src/communication/objects/GetAllChatMessage.js");

describe("GetAllChatMessage", function() {
    var TEST_ROOM_ID = 42;

    var testGetAllChatMessage;
    var roomCommunicatorMock;

    beforeEach(function() {
        roomCommunicatorMock = jasmine.createSpyObj("RoomCommunicator", ["getRoomId"]);
        roomCommunicatorMock.getRoomId.and.returnValue(TEST_ROOM_ID);
        testGetAllChatMessage = new GetAllChatMessage(roomCommunicatorMock);
    });

    it("should return the room id it was created with", function() {
        expect(testGetAllChatMessage.getRoomId()).toEqual(TEST_ROOM_ID);
    });

    it("should return the room communicator it was created with", function() {
        expect(testGetAllChatMessage.getRoomCommunicator()).toEqual(roomCommunicatorMock);
    });

    describe("create message", function() {
        var TEST_CHAT_MESSAGES = ["test1", "test2"];

        it("should return a message containing an empty list of chat messages", function() {
            expect(testGetAllChatMessage.createMessage().chatMessages).toEqual([]);
        });

        it("should return a message containing the list of chat messages that have been set", function() {
            testGetAllChatMessage.setChatMessages(TEST_CHAT_MESSAGES);
            expect(testGetAllChatMessage.createMessage().chatMessages).toEqual(TEST_CHAT_MESSAGES);
        });
    });
});
