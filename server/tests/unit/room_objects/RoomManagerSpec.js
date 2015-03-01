'use strict';
var RoomManager = require("../../../src/room_objects/RoomManager.js");

describe("RoomManager", function() {
    var TEST_USER_NAME = "Test";
    var TEST_USER = {username: TEST_USER_NAME};

    var testRoomManager;
    var testRoomId;
    var mockSocket;
    var mockSocketManager;
    var mockUserManager;
    var mockUserSession;

    beforeEach(function() {
        mockSocket = jasmine.createSpyObj("Socket", ["join", "on"]);
        mockSocketManager = jasmine.createSpyObj("socketManager", ["on", "use"]);
        mockUserManager = jasmine.createSpyObj("UserManager", ["findByAuthToken"]);
        mockUserSession = jasmine.createSpyObj("UserSession", ["getRequestToken"]);
        mockUserManager.userSession = mockUserSession;

        testRoomManager = new RoomManager(mockSocketManager, mockUserManager);
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
        var TEST_AUTH_TOKEN = "Test";
    
        var testCreateFunction;
        var mockRequest;
        var mockResponse;
             
        beforeEach(function() {
            mockUserSession.getRequestToken.and.returnValue(TEST_AUTH_TOKEN);
            spyOn(testRoomManager, "createNewRoom").and.callThrough();
            mockUserManager.userSession = mockUserSession;
            mockResponse = jasmine.createSpyObj("Response", ["sendStatus", "writeHead", "end"]);
            testCreateFunction = testRoomManager.getCreateRouteF();
        });
        
        it("should be a create function", function() {
            expect(testCreateFunction instanceof Function).toBe(true);
        });
        
        describe("authenticated users", function() {
            beforeEach(function() {
                mockUserManager.findByAuthToken.and.callFake(function(authToken, callback) {
                    callback(null, "test");
                });
            });
        
            describe("valid request types", function() {
                afterEach(function() {
                    expect(mockResponse.end).toHaveBeenCalled();
                });
            
                it("should return 200 if a post request is sent with a valid authentication token", function(done) {
                    mockResponse.writeHead.and.callFake(function(status, headers) {
                        expect(status).toBe(200);
                        expect(headers).not.toBeNull();
                    });
                    mockResponse.end.and.callFake(function() {
                        done();
                    });
                    
                    mockRequest = {method: "POST", query: {authToken: TEST_AUTH_TOKEN}};
                    testCreateFunction(mockRequest, mockResponse);
                });
            
                it("should return 200 if a get request is sent with a valid authentication token", function(done) {
                    mockResponse.writeHead.and.callFake(function(status, headers) {
                        expect(status).toBe(200);
                        expect(headers).not.toBeNull();
                    });
                    mockResponse.end.and.callFake(function() {
                        done();
                    });
                    
                    mockRequest = {method: "GET", query: {authToken: TEST_AUTH_TOKEN}};
                    testCreateFunction(mockRequest, mockResponse);
                });
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
            
            it("should create a room if a get request is sent with a valid authentication token", function() {
                mockRequest = {method: "GET", query: {authToken: TEST_AUTH_TOKEN}};
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
            
            it("should not return 200 if a get request is sent with a invalid authentication token", function(done) {
                mockResponse.sendStatus.and.callFake(function(status) {
                    expect(status).not.toBe(200);
                    done();
                });
                mockRequest = {method: "GET", query: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
            });
            
            it("should not create a room if a post request is sent with a valid authentication token", function() {
                mockRequest = {method: "POST", query: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
                expect(testRoomManager.createNewRoom).not.toHaveBeenCalled();
            });
            
            it("should not create a room if a get request is sent with a valid authentication token", function() {
                mockRequest = {method: "GET", query: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
                expect(testRoomManager.createNewRoom).not.toHaveBeenCalled();
            });
        });
    });
});