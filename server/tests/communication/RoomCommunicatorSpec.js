"use strict";
var RoomCommunicator = require('../../src/communication/RoomCommunicator.js');

describe("RoomCommunicator", function() {
    var testRoomCommunicator;
    var socketMock;
    var drawCommandLogicMock;

    beforeEach(function() {
        socketMock = jasmine.createSpyObj('Socket', ['on', 'emit']);
        drawCommandLogicMock = jasmine.createSpyObj('DrawCommandLogic', ['handleDrawCommand']);

        testRoomCommunicator = new RoomCommunicator(socketMock, drawCommandLogicMock);
    });

    describe("handleMessage", function() {
        it("should pass a message of the 'draw' type to the draw command logic", function() {
            var TEST_VALID_MSG = {msgType: "draw", drawCommand: {some: "test", fields: "k"}};

            testRoomCommunicator.handleMessage(TEST_VALID_MSG);
            expect(drawCommandLogicMock.handleDrawCommand).toHaveBeenCalledWith(TEST_VALID_MSG.drawCommand);
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