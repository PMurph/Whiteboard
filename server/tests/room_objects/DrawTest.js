"use strict";
var DrawObjects = require("../../src/room_objects/DrawModel.js");
//var Coordinates = require("../../src/room_objects/Coordinates.js");

describe("Room", function() {
    var draw;
    var defThickness = 1;
    var defColour = COLOURS.BLACK;

    describe("Draw Model", function() {
        beforeEach(function() {
            draw = new DrawObjects.DrawModel();
        });

        it('it should return good default values', function(){
            expect(draw.getId()).toBe(ROOM_ID);
        });
    });

    describe("Users", function() {
        beforeEach(function() {
            draw = new DrawObjects.Room(ROOM_ID, CREATING_USER);
        });

        it("should return the creating user's information", function() {
            expect(draw.getCreatingUser()).toEqual(CREATING_USER);
        });


        describe("Users connecting and disconnecting", function() {
            var TEST_USER2 = {userId: "1", username: "newuser"};

            beforeEach(function() {
                draw.connectUserToRoom(TEST_USER1);
                draw.connectUserToRoom(TEST_USER2);
            });

            it("should return the creating user's information and all other connected users", function() {
                expect(draw.getConnectedUsers()).toEqual([CREATING_USER, TEST_USER1, TEST_USER2]);
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
                addDrawCommand: function() {},
                getNumDrawCommandsSeen: function() {},
            };

            drawCommandWrapperMock = {
                getDrawCommand: function() {},
                sendDrawCommandToUsers: function() {},
                setNumDrawCommandsSeen: function() {},
                setUsersToPushTo: function() {},
            };

            draw = new DrawObjects.Room(ROOM_ID, CREATING_USER, whiteboardMock);
            draw.connectUserToRoom(TEST_USER1);

            spyOn(whiteboardMock, "addDrawCommand");
            spyOn(drawCommandWrapperMock, "getDrawCommand").and.returnValue(TEST_DRAW_COMMAND);
            spyOn(whiteboardMock, "getNumDrawCommandsSeen").and.returnValue(TEST_NUM_DRAW_COMMANDS_SEEN);

        });

        it('should tell the draw command wrapper to send to users', function() {
            spyOn(drawCommandWrapperMock, "sendDrawCommandToUsers");

            draw.handleDrawCommand(drawCommandWrapperMock);
            expect(drawCommandWrapperMock.sendDrawCommandToUsers).toHaveBeenCalled();
        });
    });
});
