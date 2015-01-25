var RoomObjects = require("../../src/room_objects/room.js");

describe("Room", function() {
    var room;
    var CREATING_USER = {"id": "2", "username": "testuser"};

    describe("Users", function() {
        beforeEach(function() {
            room = new RoomObjects.Room(CREATING_USER);
        });

        it("should return the creating user's information", function() {
            expect(room.getCreatingUser()).toEqual(CREATING_USER);
        });

        it("should return the creating user's information in a list if no other users have been added", function() {
            expect(room.getConnectedUsers()).toEqual([CREATING_USER]);
        });

        describe("Users connecting and disconnecting", function() {
            var TEST_USER1 = {"id": "4", "username": "otheruser"};
            var TEST_USER2 = {"id": "1", "username": "newuser"};

            beforeEach(function() {
                room.connectUserToRoom(TEST_USER1);
                room.connectUserToRoom(TEST_USER2);
            });

            it("should return the creating user's information and all other connected users", function() {
                expect(room.getConnectedUsers()).toEqual([CREATING_USER, TEST_USER1, TEST_USER2]);
            });

            it("should not return user's information that have disconnected from room", function() {
                room.disconnectUserFromRoom(TEST_USER1);
                expect(room.getConnectedUsers()).toEqual([CREATING_USER, TEST_USER2]);
            });

            it("should not contain two users with the same information", function() {
                room.connectUserToRoom(TEST_USER1);
                expect(room.getConnectedUsers()).toEqual([CREATING_USER, TEST_USER1, TEST_USER2]);
            });
        });
    });

    describe("Drawing", function() {
        var whiteboardMock;
        var drawCommandMock;
        var TEST_DRAW_COMMAND = "This is a test";

        beforeEach(function() {
            whiteboardMock = {
                addDrawCommand: function(drawCommand){},
            }

            drawCommandMock = {
                getDrawCommand: function() {},
            }

            room = new RoomObjects.Room(CREATING_USER, whiteboardMock);
        });

        it('should pass the draw command from to the whiteboard', function() {
            spyOn(drawCommandMock, "getDrawCommand").and.returnValue(TEST_DRAW_COMMAND);
            spyOn(whiteboardMock, "addDrawCommand");

            room.handleDrawCommand(drawCommandMock);

            expect(drawCommandMock.getDrawCommand).toHaveBeenCalled();
            expect(whiteboardMock.addDrawCommand).toHaveBeenCalledWith(TEST_DRAW_COMMAND);
        });
    });
});