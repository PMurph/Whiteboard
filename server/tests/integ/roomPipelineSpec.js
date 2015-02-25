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
    
    beforeEach(function(done) {
        mockUserManager = jasmine.createSpyObj("UserManager", ["findByAuthToken"]);
        mockUserManager.findByAuthToken.and.callFake(function(authToken, callback) {
            callback(null, "test");
        });
    
        socketManager = socketIO.listen(TEST_PORT);
        socketManager.zid = 5;
        
        testRoomManager = new RoomManager(socketManager, mockUserManager);
        roomId = testRoomManager.createNewRoom("test");
        
        testSocket = clientIO.connect('http://localhost:8080');
        
        setTimeout(function() {
            done();
        }, SOCKET_TIMEOUT);
    });
    
    afterEach(function() {
        testSocket.disconnect();
        socketManager.close();
    });
    
    describe("joinRoom", function() {
        beforeEach(function(done) {
            spyOn(testRoomManager, "joinRoom");
            testSocket.emit("joinRequest", {roomId: testRoomId});
            setTimeout(function() {
                done();
            }, SOCKET_TIMEOUT);
        });
    
        it("should call the room manager's joinRoom function", function(done) {
            expect(testRoomManager.joinRoom).toHaveBeenCalled();
            done();
        });
    });
});