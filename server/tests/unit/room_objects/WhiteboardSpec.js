"use strict";
var RoomObjects = require('../../../src/room_objects/Whiteboard.js');

describe("Whiteboard", function() {
    var testWhiteboard;

    beforeEach(function(){
        testWhiteboard = new RoomObjects.Whiteboard();
    });

    describe("empty whiteboard", function() {
        it("should return an empty array when retrieving all draw commands if none exist", function() {
            expect(testWhiteboard.getAllDrawCommands()).toEqual([]);
        });

        it('should return an empty array when retrieving the last 5 draw commands if none exist', function() {
            expect(testWhiteboard.getLastDrawCommands(5)).toEqual([]);
        });

        it('should return 0 for the number of draw commands seen', function() {
            expect(testWhiteboard.getNumDrawCommandsSeen()).toEqual(0);
        });
    });

    describe("populated whiteboard", function() {
        var TEST_COMMANDS = ["test", "draw command", "more"];
        beforeEach(function() {
            testWhiteboard.addDrawCommand(TEST_COMMANDS[0]);
            testWhiteboard.addDrawCommand(TEST_COMMANDS[1]);
            testWhiteboard.addDrawCommand(TEST_COMMANDS[2]);
        });

        it('should return all the draw commands put into to the whiteboard', function() {
            expect(testWhiteboard.getAllDrawCommands()).toEqual(TEST_COMMANDS);
        });

        it('should return only the last n draw commands if more than n draw commands exist', function() {
            expect(testWhiteboard.getLastDrawCommands(2)).toEqual([TEST_COMMANDS[1], TEST_COMMANDS[2]]);
        });

        it('should return all the commands if n is greated than the number of draw commands', function() {
            expect(testWhiteboard.getAllDrawCommands(5)).toEqual(TEST_COMMANDS);
        });

        it('should return the number of draw commands seen', function() {
            expect(testWhiteboard.getNumDrawCommandsSeen()).toEqual(TEST_COMMANDS.length);
        });
    });
});
