"use strict";
var communications = require('../../src/communication/RoomMessageReceiver.js');

describe("RoomMessageReceiver", function() {
    var testMsgReceiver;
    var socketMock;
    var drawCommandLogicMock;

    beforeEach(function() {
        socketMock = {
            on: function(eventType, callback) {},
        };

        drawCommandLogicMock = {
            handleDrawCommand: function(drawCommand) {},
        };

        testMsgReceiver = new communications.RoomMessageReceiver(socketMock, drawCommandLogicMock);
        spyOn(drawCommandLogicMock, 'handleDrawCommand');
    });

    it("should pass a message of the 'draw' type to the draw command logic", function() {
        var TEST_VALID_MSG = {msgType: "draw", drawCommand: {some: "test", fields: "k"}};

        testMsgReceiver.handleMessage(TEST_VALID_MSG);
        expect(drawCommandLogicMock.handleDrawCommand).toHaveBeenCalledWith(TEST_VALID_MSG.drawCommand);
    });

    it("should not pass messages that are not of the 'draw' type to the draw command logic", function() {
        var TEST_INVALID_MSG = {msgType: 'invalid', other: {test: "stuff"}};

        testMsgReceiver.handleMessage(TEST_INVALID_MSG);
        expect(drawCommandLogicMock.handleDrawCommand).not.toHaveBeenCalled();
    })
});