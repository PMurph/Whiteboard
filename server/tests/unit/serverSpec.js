"use strict";

describe("Server", function() {
    var mockMongoose = require("mongoose-mock");

    var TEST_HOSTNAME = "testHostname";
    var TEST_DB_NAME = "testDBname";
    var TEST_DB_OPTIONS = {
        mongoose: mockMongoose,
        name: TEST_DB_NAME,
        hostname: TEST_HOSTNAME,
    };

    var Server = require("../../src/server");
    var mockExpress = jasmine.createSpyObj("express", ["use","listen"]);
    var server;

    beforeEach(function() {
        spyOn(mockMongoose, "connect");
        server = new Server(mockExpress, TEST_DB_OPTIONS); 
    });

    describe("server startup", function() {
        var TEST_PORT = 3456;

        it("should start", function() {
            server.start();
            expect(mockExpress.listen).toHaveBeenCalled();
        });

        it("should set port number on start", function() {
            server.start(TEST_PORT);
            expect(server.getPort()).toBe(TEST_PORT);
        });

        it("should set port number and hostname on start", function() {
            server.start(TEST_PORT, TEST_HOSTNAME);
            expect(server.getHostname()).toBe(TEST_HOSTNAME);
        });
    });

    describe("database startup", function() {
        beforeEach(function() {
            server.start();
        });

        it("should set database hostname", function() {
            expect(server.getDBHostname()).toEqual(TEST_HOSTNAME);
        });

        it("should set database name", function() {
            expect(server.getDBName()).toBe(TEST_DB_NAME);
        });

        it("should connect to database", function() {
            expect(mockMongoose.connect).toHaveBeenCalled();
        });

        it("should connect to database with hostname and database name set with dbOptions", function() {
            expect(mockMongoose.connect).toHaveBeenCalledWith("mongodb://" + TEST_HOSTNAME + "/" + TEST_DB_NAME);
        });
    });
});
