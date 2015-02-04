"use strict";
var RoomCommunicator = require('../../../src/communication/RoomCommunicator.js');

describe("RoomCommunicator", function() {
    var TEST_ROOM_ID = 42;

    var testRoomCommunicator;
    var socketMock;
    var drawCommandLogicMock;
    var messageFactoryMock;

    beforeEach(function() {
        socketMock = jasmine.createSpyObj('Socket', ['on', 'join']);
        drawCommandLogicMock = jasmine.createSpyObj('DrawCommandLogic', ['handleDrawCommand']);
        messageFactoryMock = jasmine.createSpyObj('MessageFactory', ['wrapIncomingMessage']);

        testRoomCommunicator = new RoomCommunicator(TEST_ROOM_ID, socketMock, drawCommandLogicMock, messageFactoryMock);
    });

    it("should connect to a room with the id passed to the constructor", function() {
        expect(socketMock.join).toHaveBeenCalledWith(TEST_ROOM_ID);
    });

    describe("handleMessage", function() {
        var TEST_WRAPPED_DRAW_COMMAND_MSG = {test: "message"};
        var TEST_VALID_DRAW_MSG = {msgType: "draw", drawCommand: {some: "test", fields: "k"}};

        beforeEach(function() {
            messageFactoryMock.wrapIncomingMessage.and.returnValue(TEST_WRAPPED_DRAW_COMMAND_MSG);
            testRoomCommunicator.handleDrawCommand(TEST_VALID_DRAW_MSG);
        });

        it("should call the message factory to wrap the incoming message is of type 'draw'", function() {
            expect(messageFactoryMock.wrapIncomingMessage).toHaveBeenCalledWith(testRoomCommunicator, TEST_VALID_DRAW_MSG);
        });

        it("should pass a message of the 'draw' type to the draw command logic", function() {
            expect(drawCommandLogicMock.handleDrawCommand).toHaveBeenCalledWith(TEST_WRAPPED_DRAW_COMMAND_MSG);
        });
    });

    describe("sendMessage", function(){
        var TEST_MESSAGE_TYPE = "test type";
        var TEST_MESSAGE = {test: "data"};

        var socketBroadcastMock;
        var socketRoomMock;

        beforeEach(function() {
            socketBroadcastMock = jasmine.createSpyObj('SocketBroadcast', ['to']);

            socketMock.broadcast = socketBroadcastMock;
            socketRoomMock = jasmine.createSpyObj('SocketRoom', ['emit']);
            socketMock.broadcast.to.and.returnValue(socketRoomMock);

            testRoomCommunicator.sendMessage(TEST_MESSAGE_TYPE, TEST_MESSAGE);
        });

        it("shoudl call the socket broadcast's to method with the room id it was created with", function() {
            expect(socketBroadcastMock.to).toHaveBeenCalledWith(TEST_ROOM_ID);
        });

        it("should call the socket room's emit function with the message", function() {
            expect(socketRoomMock.emit).toHaveBeenCalledWith(TEST_MESSAGE_TYPE, TEST_MESSAGE);
        }); 
    });
});