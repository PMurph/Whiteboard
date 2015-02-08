'use strict';
var RoomManager = require("../../../src/room_objects/RoomManager.js");

describe("RoomManager", function() {
    var TEST_USER_NAME = "Test";

    var testRoomManager;
    var testRoomId;
    var socketManagerMock;

    beforeEach(function() {
        socketManagerMock = jasmine.createSpy("socketManager", ["on"]);

        testRoomManager = new RoomManager(socketManagerMock);
        testRoomManager.createNewRoom(TEST_USER_NAME);
        testRoomId = testRoomManager.createNewRoom(TEST_USER_NAME);
    });

    describe("getting a room", function() {
        it("should be able to get a room with a room id that has been created", function() {
            var room = testRoomManager.getRoom(testRoomId);

            expect(room.getId()).toEqual(testRoomId);
        });
    });

    describe("joining a room", function() {
        var socketMock;

        beforeEach(function() {
            socketMock = jasmine.createSpy('socketManager', ["join"]);
        });

        it("should allow a user to join a room that exists", function() {
            testRoomManager.joinRoom(testRoomId, socketMock);
            expect(socketMock.join).haveBeenCalledWith(testRoomId);
        });

        it("should not allow a user to join a room that does not exist", function() {

        });
    });
});