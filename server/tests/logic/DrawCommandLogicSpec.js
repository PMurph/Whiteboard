"use strict";
var logic = require("../../src/logic/DrawCommandLogic.js");

describe("DrawCommandLogic", function() {
    var roomMock;
    var drawCommandWrapperMock;
    var testDrawCommandLogic;

    beforeEach(function() {
        roomMock = {
            handleDrawCommand: function(drawCommandWrapper) {},
        };

        drawCommandWrapperMock = {

        };

        testDrawCommandLogic = new logic.DrawCommandLogic(roomMock);
    });

    it("should call the room's handleDrawCommand function with the same drawCommandWrapper if the wrapper is valid", function() {
        spyOn(roomMock, "handleDrawCommand");

        testDrawCommandLogic.handleDrawCommand(drawCommandWrapperMock);
        expect(roomMock.handleDrawCommand).toHaveBeenCalledWith(drawCommandWrapperMock);
    });
});