"use strict";
var DrawCommandLogic = require("../../src/logic/DrawCommandLogic.js");

describe("DrawCommandLogic", function() {
    var roomMock;
    var testDrawCommandLogic;

    beforeEach(function() {
        roomMock = jasmine.createSpyObj('Room', ['handleDrawCommand']);

        testDrawCommandLogic = new DrawCommandLogic(roomMock);
    });

    describe('handleDrawCommand', function() {
        var drawCommandMessageMock;

        beforeEach(function() {
            drawCommandMessageMock = jasmine.createSpyObj("DrawCommandMessage", ['handleDrawCommand', 'handleDrawResponse']);
        });

        it("should call the room's handleDrawCommand function with the same drawCommandMessage if the message is valid", function() {
            testDrawCommandLogic.handleDrawCommand(drawCommandMessageMock);
            expect(roomMock.handleDrawCommand).toHaveBeenCalledWith(drawCommandMessageMock);
        });
    });

    describe('handleDrawResponse', function() {
        var drawCommandResponseMock;
        var roomCommunicatorMock;

        beforeEach(function() {
            drawCommandResponseMock = jasmine.createSpyObj("DrawCommandResponse", ['getRoomCommunicator']);
            roomCommunicatorMock = jasmine.createSpyObj('RoomCommunicator', ['sendMessage']);

            drawCommandResponseMock.getRoomCommunicator.and.returnValue(roomCommunicatorMock);
            testDrawCommandLogic.handleDrawResponse(drawCommandResponseMock);
        });

        it("should get the DrawCommandResponse's RoomCommunicator", function() {
            expect(drawCommandResponseMock.getRoomCommunicator).toHaveBeenCalled();
        });

        it("should call the DrawCommandResponse's RoomCommunicator's sendMessage function to have been called", function() {
            expect(roomCommunicatorMock.sendMessage).toHaveBeenCalled();
        });
    });
});