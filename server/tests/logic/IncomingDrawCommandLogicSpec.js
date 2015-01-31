"use strict";
var IncomingDrawCommandLogic = require("../../src/logic/IncomingDrawCommandLogic.js");

describe("IncomingDrawCommandLogic", function() {
    var roomMock;
    var drawCommandWrapperMock;
    var testIncomingDrawCommandLogic;

    beforeEach(function() {
        roomMock = jasmine.createSpyObj('Room', ['handleDrawCommand']);
        drawCommandWrapperMock = jasmine.createSpyObj("DrawCommandWrapper", ['handleDrawCommand']);

        testIncomingDrawCommandLogic = new IncomingDrawCommandLogic(roomMock);
    });

    it("should call the room's handleDrawCommand function with the same drawCommandWrapper if the wrapper is valid", function() {
        testIncomingDrawCommandLogic.handleDrawCommand(drawCommandWrapperMock);
        expect(roomMock.handleDrawCommand).toHaveBeenCalledWith(drawCommandWrapperMock);
    });
});