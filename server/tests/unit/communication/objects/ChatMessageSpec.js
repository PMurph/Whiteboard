"use strict";
var ChatMessage = require("../../../../src/communication/objects/ChatMessage.js");

describe("ChatMessage", function() {
    var TEST_ROOM_ID = 45;
    var TEST_CHAT_ORDER_NUMBER = 42;

    var roomCommunicatorMock;
    var chat;
    var chatMessage;

    beforeEach(function() {
        chat = {name: "test", message: "message"};
        roomCommunicatorMock = jasmine.createSpyObj("RoomCommunicator", ["getRoomId"]);

        roomCommunicatorMock.getRoomId.and.returnValue(TEST_ROOM_ID);
        chatMessage = new ChatMessage(roomCommunicatorMock, chat);
    });

    it("should return the chat", function() {
        expect(chatMessage.getChatMessage()).toEqual(chat);
    });

    it("should clean HTML tags from chat message", function() {
        var dirtyChat = {name: "test", message: "<evil>injection</evil>"};
        var dirtyChatMessage = new ChatMessage(roomCommunicatorMock, dirtyChat);
        expect(dirtyChatMessage.getChatMessage().message).not.toEqual(chat.message);
        expect(dirtyChatMessage.getChatMessage().message.indexOf('<')).toEqual(-1);
        expect(dirtyChatMessage.getChatMessage().message.indexOf('>')).toEqual(-1);
    });

    it("should return the RoomCommunicator object it was created with", function() {
        expect(chatMessage.getRoomCommunicator()).toEqual(roomCommunicatorMock);
    });

    it('should return the room id passed to the contructor', function() {
        expect(chatMessage.getRoomId()).toEqual(TEST_ROOM_ID);
    });

    it('should return -1 if the chatOrderNumber has not been set', function() {
        expect(chatMessage.getChatOrder()).toEqual(-1);
    });

    it('should return the chatOrderNumber that has been set', function() {
        chatMessage.setChatOrder(TEST_CHAT_ORDER_NUMBER);
        expect(chatMessage.getChatOrder()).toEqual(TEST_CHAT_ORDER_NUMBER);
    });

    describe("creating message to send to client", function() {
        var createdMessage;

        beforeEach(function() {
            chatMessage.setChatOrder(TEST_CHAT_ORDER_NUMBER);
            createdMessage = chatMessage.createMessage();
        });

        it('should create a dictionary containing a key with the draw command as the value', function() {
            expect(createdMessage.chatMessage).toEqual(chat);
        });

        it('should create a dictionary containing a key with the draw order as the value', function() {
            expect(createdMessage.chatOrder).toEqual(TEST_CHAT_ORDER_NUMBER);
        });
    });
});
