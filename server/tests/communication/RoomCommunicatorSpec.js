"use strict";
var RoomCommunicator = require('../../src/communication/RoomCommunicator.js');

describe("RoomCommunicator", function() {
    var testRoomCommunicator;
    var socketMock;
    var drawCommandLogicMock;
    var messageFactoryMock;

    beforeEach(function() {
        socketMock = jasmine.createSpyObj('Socket', ['on', 'emit']);
        drawCommandLogicMock = jasmine.createSpyObj('DrawCommandLogic', ['handleDrawCommand']);
        messageFactoryMock = jasmine.createSpyObj('MessageFactory', ['wrapIncomingMessage']);

        testRoomCommunicator = new RoomCommunicator(socketMock, drawCommandLogicMock, messageFactoryMock);
    });

    describe("handleMessage", function() {
        var TEST_WRAPPED_DRAW_COMMAND_MSG = {test: "message"};
        var TEST_VALID_DRAW_MSG = {msgType: "draw", drawCommand: {some: "test", fields: "k"}};

        beforeEach(function() {
            messageFactoryMock.wrapIncomingMessage.and.returnValue(TEST_WRAPPED_DRAW_COMMAND_MSG);
        });

        it("should call the message factory to wrap the incoming message is of type 'draw'", function() {
            testRoomCommunicator.handleMessage(TEST_VALID_DRAW_MSG);
            expect(messageFactoryMock.wrapIncomingMessage).toHaveBeenCalledWith(TEST_VALID_DRAW_MSG);
        });

        it("should pass a message of the 'draw' type to the draw command logic", function() {
            testRoomCommunicator.handleMessage(TEST_VALID_DRAW_MSG);
            expect(drawCommandLogicMock.handleDrawCommand).toHaveBeenCalledWith(TEST_WRAPPED_DRAW_COMMAND_MSG);
        });

        it("should not pass messages that are not of the 'draw' type to the draw command logic", function() {
            var TEST_INVALID_MSG = {msgType: 'invalid', other: {test: "stuff"}};

            testRoomCommunicator.handleMessage(TEST_INVALID_MSG);
            expect(drawCommandLogicMock.handleDrawCommand).not.toHaveBeenCalled();
        });
    });

    describe("sendMessage", function(){
        var TEST_MESSAGE = {test: "data"};

        it("should call the sockets emit function with the message", function() {
            testRoomCommunicator.sendMessage(TEST_MESSAGE);

            expect(socketMock.emit).toHaveBeenCalledWith(TEST_MESSAGE);
        }); 
    });
});