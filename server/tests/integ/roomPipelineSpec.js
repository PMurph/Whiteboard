var socketIO = require('socket.io');
var clientIO = require('socket.io-client');
var RoomManager = require("../../src/room_objects/RoomManager.js");

describe('Room Pipeline', function() {
    var SOCKET_TIMEOUT = 1000;
    var TEST_PORT = 8080;
    
    var server;
    var socketManager;
    var testSocket;
    var testRoomManager;
    var mockUserManager;
    var testRoomId;
    
    beforeAll(function(done) {
        mockUserManager = jasmine.createSpyObj("UserManager", ["findByAuthToken"]);
        mockUserManager.findByAuthToken.and.callFake(function(authToken, callback) {
            callback(null, "test");
        });
    
        socketManager = socketIO.listen(TEST_PORT);
        
        testRoomManager = new RoomManager(socketManager, mockUserManager);
        roomId = testRoomManager.createNewRoom("test");
        
        testSocket = clientIO.connect('http://localhost:8080');
        
        setTimeout(function() {
            done();
        }, SOCKET_TIMEOUT);
    });
    
    afterAll(function() {
        testSocket.disconnect();
        socketManager.close();
    });
    
    describe("roomInteraction", function() {
        var TEST_VALUE1 = "test value";
        var TEST_VALUE2 = "another test";
        var TEST_DRAW_COMMAND = {vertices: [{x: 5, y:3}, {x:-1, y:4}], drawTool: {}, test: TEST_VALUE1};
        var TEST_DRAW_COMMAND2 = {vertices: [{x:1, y:2}], drawTools: {}, test: TEST_VALUE2};
        
        var returnedDrawCommand;
    
        beforeAll(function(done) {
            spyOn(testRoomManager, "joinRoom").and.callThrough();
            
            testSocket.on('drawCommand', function(data) {
                returnedDrawCommand = data.drawCommand;
            });
            
            testSocket.emit("joinRequest", {roomId: roomId.toString()});
            setTimeout(function() {
                done();
            }, SOCKET_TIMEOUT);
        });
        
        describe("joinRoom", function() {
            it("should call the room manager's joinRoom on a joinRequest", function(done) {
                expect(testRoomManager.joinRoom).toHaveBeenCalled();
                done();
            });
        });
    
        describe("drawingCommand response", function() {
            beforeEach(function(done) {
                testSocket.emit("drawCommand", TEST_DRAW_COMMAND);
                setTimeout(function() {
                    done();
                }, SOCKET_TIMEOUT);
            });
            
            it("should repeat the draw command that was sent to it", function(done) {
                expect(returnedDrawCommand.test).toEqual("test value");
                done();
            });
        });
        
        describe("getAllDrawCommands response", function() {
            var returnedDrawCommands;
            
            beforeEach(function(done) {
                testSocket.emit("drawCommand", TEST_DRAW_COMMAND2);
                
                testSocket.on("getAllDrawCommands", function(data) {
                    returnedDrawCommands = data.drawCommands;
                });
                
                testSocket.emit("getAllDrawCommands");
                
                setTimeout(function() {
                    done();
                }, SOCKET_TIMEOUT);
            });
            
            it("should return the two draw commands in the correct order", function(done) {
                expect(returnedDrawCommands.length).toBe(2);
                expect(returnedDrawCommands[0].test).toEqual(TEST_VALUE1);
                expect(returnedDrawCommands[1].test).toEqual(TEST_VALUE2);
                done();
            });
            
        });
    });
});