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

        describe("valid user", function() {
            var TEST_AUTH_TOKEN = "ValidToken";
            var TEST_USER = {authToken: TEST_AUTH_TOKEN};

            it("should authenticate user using the authentication tocken when a room request occurs", function() {
                testRoomManager.handleJoinRequest(testRoomId, TEST_AUTH_TOKEN, socketMock);
                expect(userManagerMock.findByAuthToken).toHaveBeenCalledWith(TEST_AUTH_TOKEN, jasmine.any(Function));
            });

            it("should allow a user to join a room that exists", function() {
                testRoomManager.handleJoinRequest(testRoomId, TEST_AUTH_TOKEN, socketMock);
                testRoomManager.authenticateUserCallback(null, TEST_USER);
                expect(socketMock.join).toHaveBeenCalledWith(testRoomId);
            });

            it("should not allow a user to join a room that does not exist", function() {
                testRoomManager.handleJoinRequest(42, TEST_AUTH_TOKEN, socketMock);
                testRoomManager.authenticateUserCallback(null, TEST_USER);
                expect(socketMock.join).not.toHaveBeenCalled();
            });
        });
    });
});