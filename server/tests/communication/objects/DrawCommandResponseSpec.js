"use strict";
var DrawCommandResponse = require("../../../src/communication/objects/DrawCommandResponse.js");

describe("DrawCommandResponse", function() {
    var TEST_USERS = [{username: "alice"}, {username: "bob"}];

    var testDrawCommand;
    var testRoomCommunicator;
    var testDrawCommandResponse;

    beforeEach(function() {
        testDrawCommand = {some: "test", draw: "command"};
        testRoomCommunicator = "test object";

        testDrawCommandResponse = new DrawCommandResponse(testRoomCommunicator, testDrawCommand);
    });

    it('should return the room communicator it was created with', function() {
        expect(testDrawCommandResponse.getRoomCommunicator()).toEqual(testRoomCommunicator);
    });

    it('should return the draw command it was created with', function() {
        expect(testDrawCommandResponse.getDrawCommand()).toEqual(testDrawCommand);
    });

    it('should return a list of users that the response will be sent to', function() {
        testDrawCommandResponse.setUsersToSendTo(TEST_USERS);

        expect(testDrawCommandResponse.getUsersToSendTo()).toEqual(TEST_USERS);
    })
});