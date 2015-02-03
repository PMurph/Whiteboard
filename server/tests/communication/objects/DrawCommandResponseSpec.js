"use strict";
var DrawCommandResponse = require("../../../src/communication/objects/DrawCommandResponse.js");

describe("DrawCommandResponse", function() {
    var TEST_USERS = [{username: "alice"}, {username: "bob"}];
    var TEST_NUM_DRAWS_SEEN = 6;
    var TEST_ROOM_ID = 5;

    var testDrawCommand;
    var testRoomCommunicator;
    var testDrawCommandResponse;

    beforeEach(function() {
        testDrawCommand = {some: "test", draw: "command"};
        testRoomCommunicator = "test object";

        testDrawCommandResponse = new DrawCommandResponse(TEST_ROOM_ID, testRoomCommunicator, testDrawCommand);
        testDrawCommandResponse.setUsersToSendTo(TEST_USERS);
        testDrawCommandResponse.setNumDrawCommandsSeen(TEST_NUM_DRAWS_SEEN);
    });

    it('should return the room communicator it was created with', function() {
        expect(testDrawCommandResponse.getRoomCommunicator()).toEqual(testRoomCommunicator);
    });

    it('should return the draw command it was created with', function() {
        expect(testDrawCommandResponse.getDrawCommand()).toEqual(testDrawCommand);
    });

    it('should return a list of users that the response will be sent to', function() {
        expect(testDrawCommandResponse.getUsersToSendTo()).toEqual(TEST_USERS);
    });

    it('should return the number of draw commands seen by the whiteboard at the point when the response was created', function() {
        expect(testDrawCommandResponse.getNumDrawCommandsSeen()).toEqual(TEST_NUM_DRAWS_SEEN);
    });

    it('should return the roomId of the room it was created in', function() {
        expect(testDrawCommandResponse.getRoomId()).toEqual(TEST_ROOM_ID);
    });

    describe('Formatting message to be sent to user', function() {
        var testMessage;

        beforeEach(function() {
            testMessage = testDrawCommandResponse.createResponseMessage();
        });

        it('should return a dictionary with a drawOrderNum key that has value equal to the number of draw commands seen', function() {
            expect(testMessage.drawOrderNum).toEqual(TEST_NUM_DRAWS_SEEN);
        });

        it('should return a dictionary with a roomId key that has value equal to the room id of the response', function() {
            expect(testMessage.roomId).toEqual(TEST_ROOM_ID);
        });

        it('should return a dictionary with a drawCommand key with a value equal to the drawCommand of the response', function() {
            expect(testMessage.drawCommand).toEqual(testDrawCommand);
        });
    });
});