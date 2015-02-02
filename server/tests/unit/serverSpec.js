"use strict";

describe("Server", function() {
    var Server = require('../../src/server');
    var server;
    beforeAll(function() {
       server = new Server(); 
    });
    it("should start", function() {
    });
    it("should stop", function() {
        expect(true).toBe(true);
    });
});
