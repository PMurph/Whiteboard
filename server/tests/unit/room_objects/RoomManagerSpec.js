'use strict';
var RoomManager = require("../../../src/room_objects/RoomManager.js");

describe("RoomManager", function() {
    var TEST_USER_NAME = "Test";

    var testRoomManager;
    var testRoomId;
    var socketManagerMock;
    var userManagerMock;

    beforeEach(function() {
        socketManagerMock = jasmine.createSpyObj("socketManager", ["on"]);
        userManagerMock = jasmine.createSpyObj("UserManager", ["findByAuthToken"]);

        testRoomManager = new RoomManager(socketManagerMock, userManagerMock);
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
            socketMock = jasmine.createSpyObj('socketManager', ["join"]);
        });
    });

    describe("authenticate socket messages", function() {
        var TEST_USER = {username: TEST_USER_NAME};
        var mockFunction;

        beforeEach(function() {
            mockFunction = jasmine.createSpy("callback");
        });

        it("should call the callback if there is no error message, and a valid user", function() {
            testRoomManager.authenticateUser(null, TEST_USER, mockFunction);
            expect(mockFunction).toHaveBeenCalled();
        });

        it("should not call the callback if the user is null", function() {
            testRoomManager.authenticateUser(null, null, mockFunction);
            expect(mockFunction).not.toHaveBeenCalled();
        });

        it("should not call the callback if the error is not null", function() {
            testRoomManager.authenticateUser("test", TEST_USER, mockFunction);
            expect(mockFunction).not.toHaveBeenCalled();
        });
    });
});