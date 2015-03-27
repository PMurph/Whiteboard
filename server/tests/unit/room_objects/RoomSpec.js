"use strict";
var Room = require("../../../src/room_objects/Room.js");

describe("Room", function() {
    var CREATING_USER = {id: "2", username: "testuser"};
    var TEST_USER1 = {id: "4", username: "otheruser"};
    var ROOM_ID = 3;
    var whiteboardMock;
    var chatMock;
    var documentMock;
    var room;

    beforeEach(function() {
        whiteboardMock = jasmine.createSpyObj('Whiteboard', ['addDrawCommand', 'getNumDrawCommandsSeen', "getAllDrawCommands"]);
        whiteboardMock.addDrawCommand.and.callFake(function (drawCommand, cb) {
            cb(null, room);
        });
        chatMock = jasmine.createSpyObj('Chat', ['addChatMessage']);
        documentMock = jasmine.createSpyObj('dbDocument', ['save', 'fetch']);
        documentMock.id = ROOM_ID;
        documentMock.creatingUser = CREATING_USER;
        Array.prototype.id = jasmine.createSpy().and.callFake(function (id) {
            return {
                remove: function () {
                    var index = documentMock.connectedUsers.indexOf(id);
                    documentMock.connectedUsers.splice(index, 1);
                }
            }; 
        });
        documentMock.connectedUsers = new Array();
        documentMock.connectedUsers.push(CREATING_USER.id);

        room = new Room(documentMock, whiteboardMock, chatMock);
    });

    describe("Room Id", function() {
        it('should return the correct room id', function(){
            expect(room.getId()).toBe(ROOM_ID);
        });
    });

    describe("Users", function() {
        it("should return the creating user's information", function() {
            expect(room.getCreatingUserId()).toEqual(CREATING_USER);
        });

        it("should return the creating user's information in a list if no other users have been added", function() {
            expect(room.getConnectedUsers()).toEqual([CREATING_USER.id]);
        });

        describe("Users connecting and disconnecting", function() {
            var TEST_USER2 = {id: "1", username: "newuser"};

            beforeEach(function() {
                room.connectUserToRoom(TEST_USER1);
                room.connectUserToRoom(TEST_USER2);
            });

            it("should return the creating user's information and all other connected users", function() {
                expect(room.getConnectedUsers()).toEqual([CREATING_USER.id, TEST_USER1.id, TEST_USER2.id]);
            });

            it("should not return user's information that have disconnected from room", function() {
                var cb = jasmine.createSpy();
                room.disconnectUserFromRoom(TEST_USER1, cb);
                expect(room.getConnectedUsers()).toEqual([CREATING_USER.id, TEST_USER2.id]);
            });

            it("should not contain two users with the same information", function() {
                room.connectUserToRoom(TEST_USER1);
                expect(room.getConnectedUsers()).toEqual([CREATING_USER.id, TEST_USER1.id, TEST_USER2.id]);
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
            drawCommandMessageMock = jasmine.createSpyObj('DrawCommandMessage', ['getDrawCommand', 'setDrawOrder']);
            drawCommandLogicMock = jasmine.createSpyObj('DrawCommandLogic', ['handleDrawResponse']);

            room.connectUserToRoom(TEST_USER1);

            drawCommandMessageMock.getDrawCommand.and.returnValue(TEST_DRAW_COMMAND);
            whiteboardMock.getNumDrawCommandsSeen.and.returnValue(TEST_NUM_DRAW_COMMANDS_SEEN);

            room.handleDrawCommand(drawCommandMessageMock, drawCommandLogicMock);
        });

        describe("Receiving Drawing Command", function() {
            it('should get the draw command from the draw command wrapper', function() {
                expect(drawCommandMessageMock.getDrawCommand).toHaveBeenCalled();
            });

            it('should pass the draw command from to the whiteboard', function() {
                expect(whiteboardMock.addDrawCommand).toHaveBeenCalledWith(TEST_DRAW_COMMAND, jasmine.any(Function));
            });

            it('should get the number of draw commands seen by the whiteboard', function() {
                expect(whiteboardMock.getNumDrawCommandsSeen).toHaveBeenCalled();
            });
        });

        describe("Responding to Draw Command", function() {
            it('should set the draw order of the drawCommandMessage with the number of draw commands seen by the whiteboard', function() {
                expect(drawCommandMessageMock.setDrawOrder).toHaveBeenCalledWith(TEST_NUM_DRAW_COMMANDS_SEEN);
            });

            it("should call the DrawCommandLogic's handleDrawResponse method", function() {
                expect(drawCommandLogicMock.handleDrawResponse).toHaveBeenCalledWith(drawCommandMessageMock);
            });
        });
    });

    describe("Getting all draw commands", function() {
        var TEST_DRAW_COMMANDS = ["Test1", "Test2", "Test3"];

        var getAllDrawCommandsMessageMock;
        var drawCommandLogicMock;

        beforeEach(function() {
            drawCommandLogicMock = jasmine.createSpyObj("DrawCommandLogic", ["handleGetAllDrawCommandsResponse"]);
            getAllDrawCommandsMessageMock = jasmine.createSpyObj('GetAllDrawCommandsMessage', ["setDrawCommands"]);
            whiteboardMock.getAllDrawCommands.and.returnValue(TEST_DRAW_COMMANDS);

            room.handleGetAllDrawCommands(getAllDrawCommandsMessageMock, drawCommandLogicMock);
        });

        it("should get all the draw commands from the whiteboard", function() {
            expect(whiteboardMock.getAllDrawCommands).toHaveBeenCalled();
        });

        it("should set the getAllDrawCommandsMessage draw commands", function() {
            expect(getAllDrawCommandsMessageMock.setDrawCommands).toHaveBeenCalledWith(TEST_DRAW_COMMANDS);
        });

        it("should call the drawCommandLogic's handleGetAllDrawCommandsResponse function", function() {
            expect(drawCommandLogicMock.handleGetAllDrawCommandsResponse).toHaveBeenCalledWith(getAllDrawCommandsMessageMock);
        });
    });
});
