"use strict";

describe("Server", function() {
    var Server = require("../../src/server");
    var mockMongoose = require("mongoose-mock");
    var mockExpress = jasmine.createSpyObj("express", ["use","listen"]);
    var server;
    beforeEach(function() {
        var dbOptions = {
            mongoose: mockMongoose
        };
        server = new Server(mockExpress, dbOptions); 
    });
    it("should start", function() {
        server.start();
        expect(mockExpress.listen).toHaveBeenCalled();
    });
    it("should set port number on start", function() {
        var testPort = 3456;
        server.start(testPort);

        expect(server.getPort()).toBe(testPort);
    });
    it("should set port number and hostname on start", function() {
        var testPort = 3456;
        var testHostname = "testHostname";

        server.start(testPort, testHostname);
        expect(server.getHostname()).toBe(testHostname);
    });
    it("should set port number and hostname on start", function() {
        var testPort = 3456;
        var testHostname = "testHostname";

        server.start(testPort, testHostname);
        expect(server.getHostname()).toBe(testHostname);
    });
    it("should set database hostname", function() {
        var testHostname = "testHostname";
        var testDBOptions = {
            mongoose: mockMongoose,
            hostname: testHostname
        };
        server = new Server(mockExpress, testDBOptions);

        expect(server.getDBHostname()).toBe(testHostname);
    });
    it("should set database name", function() {
        var testDBName = "testDBname";
        var testDBOptions = {
            mongoose: mockMongoose,
            name: testDBName
        };
        server = new Server(mockExpress, testDBOptions);

        expect(server.getDBName()).toBe(testDBName);
    });
});
