'use strict';
var RoomManager = require("../../../src/room_objects/RoomManager.js");

describe("RoomManager", function() {
    var TEST_AUTH_TOKEN = "Test";
    var TEST_USER_NAME = "Test";
    var TEST_USER = {username: TEST_USER_NAME};

    var testRoomManager;
    var testRoomId;
    var mockRequest;
    var mockResponse;
    var mockSocket;
    var mockSocketManager;
    var mockUserManager;
    var mockUserSession;

    beforeEach(function() {
        mockResponse = jasmine.createSpyObj("Response", ["sendStatus", "json"]);
        mockSocket = jasmine.createSpyObj("Socket", ["join", "on"]);
        mockSocketManager = jasmine.createSpyObj("socketManager", ["on", "use"]);
        mockUserManager = jasmine.createSpyObj("UserManager", ["findByAuthToken"]);
        mockUserSession = jasmine.createSpyObj("UserSession", ["getRequestToken"]);
        mockUserSession.getRequestToken.and.returnValue(TEST_AUTH_TOKEN);
        mockUserSession.userManager = mockUserManager;

        testRoomManager = new RoomManager(mockSocketManager, mockUserSession);
        testRoomManager.createNewRoom(TEST_USER_NAME, mockSocket);
        testRoomId = testRoomManager.createNewRoom(TEST_USER_NAME, mockSocket);
    });

    it("should setup socket middleware callback on initialization", function() {
        expect(mockSocketManager.use).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it("should setup socket conntection callback on initialization", function() {
        expect(mockSocketManager.on).toHaveBeenCalledWith("connection", jasmine.any(Function));
    });

    describe("getting a room", function() {
        it("should be able to get a room with a room id that has been created", function() {
            var room = testRoomManager.getRoom(testRoomId);

            expect(room.getId()).toEqual(testRoomId);
        });
    });
    
    describe("getting a list of rooms", function() {
        var testRoomId1;
        var testRoomId2;
        var testRoomId3;
        
        var roomList;
        
        beforeEach(function() {
            testRoomManager._rooms = {};
            testRoomId1 = testRoomManager.createNewRoom(TEST_USER_NAME, mockSocket);
            testRoomId2 = testRoomManager.createNewRoom(TEST_USER_NAME, mockSocket);
            testRoomId3 = testRoomManager.createNewRoom(TEST_USER_NAME, mockSocket);
            
            roomList = testRoomManager.getRoomList();
        });
        
        it("should return a list with 3 room ids", function() {
            expect(roomList.length).toBe(3);
        });
        
        it("should contain the ids of the rooms created", function() {
            expect(roomList.indexOf(testRoomId1)).toBeGreaterThan(-1);
            expect(roomList.indexOf(testRoomId2)).toBeGreaterThan(-1);
            expect(roomList.indexOf(testRoomId3)).toBeGreaterThan(-1);
        });
        
        it("should not contain an id that is not one of the rooms that has been created", function() {
            expect(roomList.indexOf(-5467)).not.toBeGreaterThan(-1);
        });
    });

    describe("joining a room", function() {
        var mockSocket;

        beforeEach(function() {
            mockSocket = jasmine.createSpyObj('socketManager', ["join", "on"]);
        });

        it("should call the sockets join method with the room id if the room exists", function() {
            testRoomManager.joinRoom(testRoomId, TEST_USER, mockSocket);
            expect(mockSocket.join).toHaveBeenCalledWith(testRoomId);
        });

        it("should not call the sockets join method if the room doesn't exist", function() {
            testRoomManager.joinRoom(42, TEST_USER, mockSocket);
            expect(mockSocket.join).not.toHaveBeenCalled();
        });
    });

    describe("authenticate socket messages", function() {
        var mockAuthenticatedFunction;
        var mockUnauthenticatedFunction;

        beforeEach(function() {
            mockAuthenticatedFunction = jasmine.createSpy("authenitcated_callback");
            mockUnauthenticatedFunction = jasmine.createSpy("unauthenticated_callback");
        });

        it("should call the authenticated user callback if there is no error message, and a valid user", function() {
            testRoomManager.authenticateUser(null, TEST_USER, mockAuthenticatedFunction, mockUnauthenticatedFunction);
            expect(mockAuthenticatedFunction).toHaveBeenCalled();
        });
        
        it("should not call the unauthenticated user callback if there is no error message, and a valid user", function() {
            testRoomManager.authenticateUser(null, TEST_USER, mockAuthenticatedFunction, mockUnauthenticatedFunction);
            expect(mockUnauthenticatedFunction).not.toHaveBeenCalled();
        });

        it("should not call the authenticated user callback if the user is null", function() {
            testRoomManager.authenticateUser(null, null, mockAuthenticatedFunction, mockUnauthenticatedFunction);
            expect(mockAuthenticatedFunction).not.toHaveBeenCalled();
        });
        
        it("should call the unauthenticated user callback if the user is null", function() {
            testRoomManager.authenticateUser(null, null, mockAuthenticatedFunction, mockUnauthenticatedFunction);
            expect(mockUnauthenticatedFunction).toHaveBeenCalled();
        });

        it("should not call the callback if the error is not null", function() {
            testRoomManager.authenticateUser("test", TEST_USER, mockAuthenticatedFunction, mockUnauthenticatedFunction);
            expect(mockAuthenticatedFunction).not.toHaveBeenCalled();
        });
        
        it("should call the callback is the error is not null", function() {
            testRoomManager.authenticateUser("test", TEST_USER, mockAuthenticatedFunction, mockUnauthenticatedFunction);
            expect(mockUnauthenticatedFunction).toHaveBeenCalled();
        });
    });
    
    describe("creating room routing", function() {
        var testCreateFunction;
             
        beforeEach(function() {
            spyOn(testRoomManager, "createNewRoom").and.callThrough();
            mockUserManager.userSession = mockUserSession;
            testCreateFunction = testRoomManager.getRoomRouteF();
        });
        
        it("should be a function", function() {
            expect(testCreateFunction instanceof Function).toBe(true);
        });
        
        describe("authenticated users", function() {
            beforeEach(function() {
                mockUserManager.findByAuthToken.and.callFake(function(authToken, callback) {
                    callback(null, "test");
                });
            });
            
            it("should return json if a post request is sent with a valid authentication token", function(done) {
                mockResponse.json.and.callFake(function(jsonObject) {
                    expect(jsonObject).not.toBeNull();
                    done();
                });
                    
                mockRequest = {method: "POST", query: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
            });
            
            it("should return 400 if a request is sent with a valid authentication token but is neither a post nor get", function(done) {
                mockResponse.sendStatus.and.callFake(function(status) {
                    expect(status).toBe(400);
                    done();
                });
                mockRequest = {method: "BAD", query: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
            });
            
            it("should create a room if a post request is sent with a valid authentication token", function() {
                mockRequest = {method: "POST", query: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
                expect(testRoomManager.createNewRoom).toHaveBeenCalled();
            });
            
            it("should not cretae a room if a request is sent with a valid authentication token but is neither a post nor get", function() {
                mockRequest = {method: "BAD", query: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
                expect(testRoomManager.createNewRoom).not.toHaveBeenCalled();
            });
        });
        
        describe("unauthorized users", function() {
            beforeEach(function() {
                 mockUserManager.findByAuthToken.and.callFake(function(authToken, callback) {
                    callback(null, null);
                });
            });
            
            it("should not return 200 if a post request is sent with a invalid authentication token", function(done) {
                mockResponse.sendStatus.and.callFake(function(status) {
                    expect(status).not.toBe(200);
                    done();
                });
                mockRequest = {method: "POST", query: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
            });
            
            it("should not create a room if a post request is sent with a valid authentication token", function() {
                mockRequest = {method: "POST", query: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
                expect(testRoomManager.createNewRoom).not.toHaveBeenCalled();
            });
        });
    });
    
    describe("get room list routing", function() {
        var testGetRoomListFunction;
        
        beforeEach(function() {
            spyOn(testRoomManager, 'getRoomList').and.callThrough();
            testGetRoomListFunction = testRoomManager.getRoomRouteF();
        });
        
        it("should return json if a get request is received", function(done) {
            mockResponse.json.and.callFake(function(jsonObject) {
                expect(jsonObject).not.toBeNull();
                done();
            });
                    
            mockRequest = {method: "GET"};
            testGetRoomListFunction(mockRequest, mockResponse);
        });
        
        it("should call the getRoomList function on a valid request", function() {
            mockRequest = {method: "GET"};
            testGetRoomListFunction(mockRequest, mockResponse);
            expect(testRoomManager.getRoomList).toHaveBeenCalled();
        });
        
        it("should not call the getRoomList function on an invalid request", function() {
            mockRequest = {method: "BAD"};
            testGetRoomListFunction(mockRequest, mockResponse);
            expect(testRoomManager.getRoomList).not.toHaveBeenCalled();
        });
    });
});
