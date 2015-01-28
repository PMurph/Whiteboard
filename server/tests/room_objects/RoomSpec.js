"use strict";
var RoomObjects = require("../../src/room_objects/Room.js");

describe("Room", function() {
    var room;
    var CREATING_USER = {userId: "2", username: "testuser"};
    var TEST_USER1 = {userId: "4", username: "otheruser"};
    var ROOM_ID = 3;

    describe("Room Id", function() {
        beforeEach(function() {
            room = new RoomObjects.Room(ROOM_ID, CREATING_USER);
        });

        it('should return the correct room id', function(){
            expect(room.getId()).toBe(ROOM_ID);
        });
    });

    describe("Users", function() {
        beforeEach(function() {
            room = new RoomObjects.Room(ROOM_ID, CREATING_USER);
        });

        it("should return the creating user's information", function() {
            expect(room.getCreatingUser()).toEqual(CREATING_USER);
        });

        it("should return the creating user's information in a list if no other users have been added", function() {
            expect(room.getConnectedUsers()).toEqual([CREATING_USER]);
        });

        describe("Users connecting and disconnecting", function() {
            var TEST_USER2 = {userId: "1", username: "newuser"};

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
        var drawCommandWrapperMock;
        var TEST_DRAW_COMMAND = "This is a test";
        var TEST_NUM_DRAW_COMMANDS_SEEN = 3;

        beforeEach(function() {
            whiteboardMock = {
                addDrawCommand: function(drawCommand) {},
                getNumDrawCommandsSeen: function() {},
            }

            drawCommandWrapperMock = {
                getDrawCommand: function() {},
                sendDrawCommandToUsers: function() {},
                setNumDrawCommandsSeen: function(numDrawCommandsSeen) {},
                setUsersToPushTo: function(userToSendTo) {},
            }

            room = new RoomObjects.Room(ROOM_ID, CREATING_USER, whiteboardMock);
            room.connectUserToRoom(TEST_USER1);

            spyOn(whiteboardMock, "addDrawCommand");
            spyOn(drawCommandWrapperMock, "getDrawCommand").and.returnValue(TEST_DRAW_COMMAND);
            spyOn(whiteboardMock, "getNumDrawCommandsSeen").and.returnValue(TEST_NUM_DRAW_COMMANDS_SEEN);

        });

        it('should get the draw command from the draw command wrapper', function() {
            room.handleDrawCommand(drawCommandWrapperMock);
            expect(drawCommandWrapperMock.getDrawCommand).toHaveBeenCalled();
        })

        it('should pass the draw command from to the whiteboard', function() {
            room.handleDrawCommand(drawCommandWrapperMock);
            expect(whiteboardMock.addDrawCommand).toHaveBeenCalledWith(TEST_DRAW_COMMAND);
        });

        it('should pass the draw command wrapper all the connected users', function() {
            spyOn(drawCommandWrapperMock, "setUsersToPushTo");

            room.handleDrawCommand(drawCommandWrapperMock);
            expect(drawCommandWrapperMock.setUsersToPushTo).toHaveBeenCalledWith(room.getConnectedUsers());
        });

        it('should get the number of draw commands seen by the whiteboard', function() {
            room.handleDrawCommand(drawCommandWrapperMock);
            expect(whiteboardMock.getNumDrawCommandsSeen).toHaveBeenCalled();
        });

        it('should pass the number of draw commands seen to the draw command wrapper', function(){
            spyOn(drawCommandWrapperMock, "setNumDrawCommandsSeen");

            room.handleDrawCommand(drawCommandWrapperMock);
            expect(drawCommandWrapperMock.setNumDrawCommandsSeen).toHaveBeenCalledWith(TEST_NUM_DRAW_COMMANDS_SEEN);
        });

        it('should tell the draw command wrapper to send to users', function() {
            spyOn(drawCommandWrapperMock, "sendDrawCommandToUsers");

            room.handleDrawCommand(drawCommandWrapperMock);
            expect(drawCommandWrapperMock.sendDrawCommandToUsers).toHaveBeenCalled();
        });
    });
});