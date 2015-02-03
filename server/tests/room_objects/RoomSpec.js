"use strict";
var Room = require("../../src/room_objects/Room.js");

describe("Room", function() {
    var CREATING_USER = {userId: "2", username: "testuser"};
    var TEST_USER1 = {userId: "4", username: "otheruser"};
    var ROOM_ID = 3;
    var whiteboardMock;
    var messageFactoryMock;
    var room;

    beforeEach(function() {
        whiteboardMock = jasmine.createSpyObj('Whiteboard', ['addDrawCommand', 'getNumDrawCommandsSeen']);
        messageFactoryMock = jasmine.createSpyObj('MessageFactory', ['createResponseFromMessage']);

        room = new Room(ROOM_ID, CREATING_USER, whiteboardMock, messageFactoryMock);
    });

    describe("Room Id", function() {
        it('should return the correct room id', function(){
            expect(room.getId()).toBe(ROOM_ID);
        });
    });

    describe("Users", function() {
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
        var TEST_DRAW_COMMAND = "This is a test";
        var TEST_NUM_DRAW_COMMANDS_SEEN = 3;
        var drawCommandMessageMock;
        var drawCommandResponseMock;
        var drawCommandLogicMock;

        beforeEach(function(){
            drawCommandMessageMock = jasmine.createSpyObj('DrawCommandMessage', ['getDrawCommand', 'sendDrawCommandToUsers', 'setNumDrawCommandsSeen', 'setUsersToPushTo']);
            drawCommandResponseMock = jasmine.createSpyObj('DrawCommandResponse', ['setUsersToSendTo', 'setNumDrawCommandsSeen']);
            drawCommandLogicMock = jasmine.createSpyObj('DrawCommandLogic', ['handleDrawResponse']);

            room.connectUserToRoom(TEST_USER1);

            drawCommandMessageMock.getDrawCommand.and.returnValue(TEST_DRAW_COMMAND);
            whiteboardMock.getNumDrawCommandsSeen.and.returnValue(TEST_NUM_DRAW_COMMANDS_SEEN);
            messageFactoryMock.createResponseFromMessage.and.returnValue(drawCommandResponseMock);

            room.handleDrawCommand(drawCommandMessageMock, drawCommandLogicMock);
        });

        describe("Receiving Drawing Command", function() {
            it('should get the draw command from the draw command wrapper', function() {
                expect(drawCommandMessageMock.getDrawCommand).toHaveBeenCalled();
            });

            it('should pass the draw command from to the whiteboard', function() {
                expect(whiteboardMock.addDrawCommand).toHaveBeenCalledWith(TEST_DRAW_COMMAND);
            });

            it('should get the number of draw commands seen by the whiteboard', function() {
                expect(whiteboardMock.getNumDrawCommandsSeen).toHaveBeenCalled();
            });
        });

        describe("Responding to Draw Command", function() {
            it('should get a response from the MessageFactory', function() {
                expect(messageFactoryMock.createResponseFromMessage).toHaveBeenCalledWith(drawCommandMessageMock);
            });

            it('should give the list of users to the DrawCommandResponse', function() {
                expect(drawCommandResponseMock.setUsersToSendTo).toHaveBeenCalledWith(room.getConnectedUsers());
            });

            it('should give the number of draw commands seen by the whiteboard to the DrawCommandResponse', function() {
                expect(drawCommandResponseMock.setNumDrawCommandsSeen).toHaveBeenCalledWith(TEST_NUM_DRAW_COMMANDS_SEEN);
            });

            it("should call the DrawCommandLogic's handleDrawResponse method", function() {
                expect(drawCommandLogicMock.handleDrawResponse).toHaveBeenCalledWith(drawCommandResponseMock);
            });
        });
    });
});
