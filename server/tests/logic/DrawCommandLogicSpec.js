"use strict";
var DrawCommandLogic = require("../../src/logic/DrawCommandLogic.js");

describe("DrawCommandLogic", function() {
    var roomMock;
    var drawCommandWrapperMock;
    var testDrawCommandLogic;

    beforeEach(function() {
        roomMock = jasmine.createSpyObj('Room', ['handleDrawCommand']);
        drawCommandWrapperMock = jasmine.createSpyObj("DrawCommandLogic", ['handleDrawCommand']);

        testDrawCommandLogic = new DrawCommandLogic(roomMock);
    });

    it("should call the room's handleDrawCommand function with the same drawCommandWrapper if the wrapper is valid", function() {
        testDrawCommandLogic.handleDrawCommand(drawCommandWrapperMock);
        expect(roomMock.handleDrawCommand).toHaveBeenCalledWith(drawCommandWrapperMock);
    });
});