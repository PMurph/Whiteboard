'use strict';
var RoomManager = require("../../../src/room_objects/RoomManager.js"),
    mockMongoose = require("mongoose-mock");

describe("RoomManager", function() {
    var TEST_AUTH_TOKEN = "Test";
    var TEST_USER_NAME = "Test";
    var TEST_USER = {username: TEST_USER_NAME};

    var testRoomManager;
    var testRoomId;
    var testRoomMock;
    var mockBroadcast;
    var mockRequest;
    var mockResponse;
    var mockSocket;
    var mockSocketManager;
    var mockUserManager;
    var mockUserSession;
    var mockUser;
    var roomModel;
    
    beforeEach(function() {
        testRoomMock = {
            getId: function () {return testRoomId;}
        };
        mockBroadcast = jasmine.createSpyObj("SocketBroadcast", ["to"]);
        mockResponse = jasmine.createSpyObj("Response", ["sendStatus", "json"]);
        mockSocket = jasmine.createSpyObj("Socket", ["join", "on", "emit"]);
        mockBroadcast.to.and.returnValue(mockSocket);
        mockSocket.broadcast = mockBroadcast;
        mockSocketManager = jasmine.createSpyObj("socketManager", ["on", "use"]);
        mockUserManager = jasmine.createSpyObj("UserManager", ["findByAuthToken"]);
        mockUserSession = jasmine.createSpyObj("UserSession", ["getRequestToken"]);
        mockUserSession.getRequestToken.and.returnValue(TEST_AUTH_TOKEN);
        mockUserSession.userManager = mockUserManager;
        mockUser = jasmine.createSpyObj("user", ["anonymous"]);

        testRoomManager = new RoomManager(mockSocketManager, mockUserSession, mockMongoose);
        roomModel = mockMongoose.model("Room");
        roomModel.prototype.save = jasmine.createSpy("save");
        roomModel.find  = jasmine.createSpy("find").and.callFake(function () {
            return {
                sort: function() {
                    return {
                        select: function() {
                            return {
                                exec: function(cb) {
                                    cb(null, testRoomMock);
                                }
                            };
                        }
                    };
                }
            };
        });
        roomModel.findById = jasmine.createSpy("findById").and.callFake(function() {
            return {
                exec: function(cb) {
                    cb(null, testRoomMock);
                }
            };
        });

        testRoomManager._createNewRoom(TEST_USER_NAME);
        testRoomId = 3;
    });
    
    it("should setup socket conntection callback on initialization", function() {
        expect(mockSocketManager.on).toHaveBeenCalledWith("connection", jasmine.any(Function));
    });

    describe("getting a room", function() {
        it("should be able to get a room by id that has been created", function(done) {
            var cb = function(erro, room) {
                expect(room.getId()).toEqual(testRoomId);
             
                done();
            };
            testRoomManager.getRoomById(testRoomId, cb);
        });
    });
    
    describe("getting a list of rooms", function() {
        var roomList;
        var cb = jasmine.createSpy("databaseCallback");
        
        beforeEach(function() {
            roomList = testRoomManager.getRoomList(mockUser, cb);
        });
        
        it("should query database", function() {
            expect(roomModel.find).toHaveBeenCalled();
        });

        it("should call database callback", function() {
            expect(cb).toHaveBeenCalled();
        });
    });

    describe("joining a room", function() {
        it("should call the sockets join method with the room id if the room exists", function() {
            var testRoom = jasmine.createSpyObj("Room", ["getId", "connectUserToRoom"]);
            testRoom.getId.and.returnValue(testRoomId);
            testRoomManager.joinRoom(testRoom, TEST_USER, mockSocket);
            expect(mockSocket.join).toHaveBeenCalledWith(testRoomId);
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
            spyOn(testRoomManager, "_createNewRoom").and.callThrough();
            testRoomManager._createNewRoom.and.callFake(function(a, b, c, d, e, cb) {
                cb(null, {id: testRoomId});
            });
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
                    
                mockRequest = {method: "POST", body: {authToken: TEST_AUTH_TOKEN, name: "Test Room 1"}};
                testCreateFunction(mockRequest, mockResponse);
            });
            
            it("should return 405 if a request method is unsupported", function(done) {
                mockResponse.sendStatus.and.callFake(function(status) {
                    expect(status).toBe(405);
                    done();
                });
                mockRequest = {method: "BAD", query: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
            });
            
            it("should create a room if a post request is sent with a valid authentication token", function() {
                mockRequest = {method: "POST", body: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
                expect(testRoomManager._createNewRoom).toHaveBeenCalled();
            });
            
            it("should not create a room if a request is sent with a valid authentication token but is neither a post nor get", function() {
                mockRequest = {method: "BAD", query: {authToken: TEST_AUTH_TOKEN}};
                testCreateFunction(mockRequest, mockResponse);
                expect(testRoomManager._createNewRoom).not.toHaveBeenCalled();
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
                expect(testRoomManager._createNewRoom).not.toHaveBeenCalled();
            });
        });
    });
    
    describe("get room list routing", function() {
        var testGetRoomListFunction;
        
        beforeEach(function() {
            mockUserManager.findByAuthToken.and.callFake(function(authToken, callback) {
                callback(null, "test");
            });
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
