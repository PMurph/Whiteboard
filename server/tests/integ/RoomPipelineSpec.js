"use strict";
var socketIO = require('socket.io');
var clientIO = require('socket.io-client');
var mockMongoose = require('mongoose-mock');
var RoomManager = require("../../src/room_objects/RoomManager.js");

describe('Room Pipeline', function() {
    var SOCKET_TIMEOUT = 1000;
    var TEST_PORT = 8888;
    
    var originalTimeout;
    var socketManager;
    var testSocket;
    var testRoomManager;
    var mockUserManager;
    var mockUserSession;
    var testRoomId;
    
    beforeAll(function(done) {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = SOCKET_TIMEOUT * 10;
    
        mockUserManager = jasmine.createSpyObj("UserManager", ["findByAuthToken"]);
        mockUserManager.findByAuthToken.and.callFake(function(authToken, callback) {
            callback(null, "test");
        });
        mockUserSession = {
            userManager: mockUserManager
        };
    
        socketManager = socketIO.listen(TEST_PORT);

        var mockRoom;
        testRoomId = 3;
        testRoomManager = new RoomManager(socketManager, mockUserSession, mockMongoose);

        var mockRoomModel = mockMongoose.model("Room");
        mockRoomModel.prototype.save = function(cb) {
            mockRoom = this;
            cb(null, this);
        };
        mockRoomModel.prototype.connectedUsers = [];
        Array.prototype.toObject = function () {return this;};
        mockRoomModel.prototype.drawCommands = new Array(); // jshint ignore:line
        mockRoomModel.prototype.id = testRoomId.toString();
        mockRoomModel.findById = jasmine.createSpy("findModelById").and.callFake(function () {
            return {
                exec: function (cb) {
                    cb(null, mockRoom);
                }
            };
        });
        var mockCB = jasmine.createSpy("callback");
        testRoomManager._createNewRoom("test", "id", "public", "allowAnon", "invited", mockCB);
        
        testSocket = clientIO.connect('http://localhost:' + TEST_PORT);
        
        spyOn(testRoomManager, "joinRoom").and.callThrough();
        testSocket.emit("joinRequest", {roomId: testRoomId.toString()});
        
        setTimeout(function() {
            done();
        }, SOCKET_TIMEOUT);
    });
    
    afterAll(function() {
        testSocket.disconnect();
        socketManager.close();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    
    describe("roomInteraction", function() {
        var TEST_VALUE1 = "test value";
        var TEST_VALUE2 = "another test";
        var TEST_DRAW_COMMAND = {vertices: [{x: 5, y:3}, {x:-1, y:4}], drawTool: {}, test: TEST_VALUE1};
        var TEST_DRAW_COMMAND2 = {vertices: [{x:1, y:2}], drawTool: {}, test: TEST_VALUE2};
        
        var responseValue;

        it("should call the room manager's joinRoom on a joinRequest", function() {
            expect(testRoomManager.joinRoom).toHaveBeenCalled();
        });
        
        it("should repeat the draw command that was sent to it", function(done) {
            responseValue = TEST_VALUE1;
            testSocket.on('drawCommand', function(response) {
                expect(response.drawCommand.test).toEqual(responseValue);
                done();
            });
            testSocket.emit("drawCommand", TEST_DRAW_COMMAND);
        });
        
        describe("getAllDrawCommands response", function() {
            beforeAll(function() {
                responseValue = TEST_VALUE2;
                testSocket.emit("drawCommand", TEST_DRAW_COMMAND2);
            });
            
            it("should return the two draw commands in the correct order", function(done) {
                testSocket.on("getAllDrawCommands", function(response) {
                    expect(response.drawCommands.length).toBe(2);
                    expect(response.drawCommands[0].test).toEqual(TEST_VALUE1);
                    expect(response.drawCommands[1].test).toEqual(TEST_VALUE2);
                    done();
                });
                testSocket.emit("getAllDrawCommands");
            });
        });
    });
});
