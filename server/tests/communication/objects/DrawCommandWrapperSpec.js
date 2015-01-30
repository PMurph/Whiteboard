"use strict";
var communications = require("../../../src/communication/objects/DrawCommandWrapper.js");

describe("DrawCommandWrapper", function() {
    var testDrawCommand;
    var testDrawCommandWrapper;

    beforeEach(function() {
        testDrawCommand = {some: "test", draw: "command"};

        testDrawCommandWrapper = new communications.DrawCommandWrapper(testDrawCommand);
    });

    it("should return the testDrawCommand", function() {
        expect(testDrawCommandWrapper.getDrawCommand()).toEqual(testDrawCommand);
    });
});