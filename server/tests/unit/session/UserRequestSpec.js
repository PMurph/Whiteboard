"use strict";

describe("User Request Handling", function() {
    var UserRequest = require("../../../src/session/UserRequest"),
        userRequest,
        mockUserManager,
        mockUserSession;
        
    beforeEach(function() {
        mockUserSession = jasmine.createSpyObj("userSession", ["authUser", "authAnonymous", "getRequestToken"]);
        mockUserManager = jasmine.createSpyObj("userManager", ["findByAuthToken", "findByLogin", "updateUser"]);
        userRequest = new UserRequest(mockUserManager, mockUserSession);
    });
    describe("Request routing function", function() {
        var routeF,
            res,
            req,
            mockUser;
        it("should create proper route function", function() {
            routeF = userRequest.getRouteF();
            expect(routeF instanceof Function).toBe(true);
            expect(routeF.length).toBe(2);
        });
        beforeEach(function() {
            mockUser = jasmine.createSpyObj("User", ["toObject"]);
            routeF = userRequest.getRouteF();
            
            /* Mock express request and recevie objects */
            req = jasmine.createSpyObj("req", ["method", "body"]);
            res = jasmine.createSpyObj("res", ["send", "sendStatus", "json"]);

            mockUserManager.findByAuthToken.and.callFake(function(authToken, callback) {
                mockUser.authToken = authToken;
                callback(null, mockUser);
            });
            mockUserManager.updateUser.and.callFake(function(user, userChanges, callback) {
                callback(null, jasmine.createSpyObj("userDocument", ["toObject"]));   
            });
            mockUserSession.authAnonymous.and.callFake(function(displayName, callback) {
                callback(null, jasmine.createSpyObj("userDocument", ["toObject"]));   
            });
            mockUserSession.authUser.and.callFake(function(login, password, save, callback) {
                callback(null, jasmine.createSpyObj("userDocument", ["toObject"]));   
            });
        });
        function createMockRequest(method, mockReq) {
            req.method = method;
            if(method === "POST") {
                req.body = mockReq;
            }else if(method === "GET") {
                req.query = mockReq;
            }
            mockUserSession.getRequestToken.and.callFake(function() {
                if (mockReq.authToken) {
                    return mockReq.authToken;   
                }else{
                    return "";
                }
            });

            return req;
        }
        describe("Anonymous Autentication", function() {
            var testName = "TestDisplayName";
            var anonAuthTest = {
                wellFormedName: {
                    anonymous: true,
                    name: testName
                },
                wellFormed: {
                    anonymous: true
                },
                malformedAnonFalse: {
                    anonymous: false
                },
                malformedAuthTokenSet: {
                    anonymous: true,
                    authToken: "TestAuthenticationToken"
                },
                malformedEmpty: {

                }
            };
            it("should respond with User Document (Well Formed Name)", function() {
                req = createMockRequest("POST", anonAuthTest.wellFormedName);

                routeF(req, res);
                
                expect(mockUserSession.authAnonymous).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should respond with User Document on (Well Formed)", function() {
                req = createMockRequest("POST", anonAuthTest.wellFormed);

                routeF(req, res);

                expect(mockUserSession.authAnonymous).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should NOT respond (Malformed Anonymous False)", function() {
                req = createMockRequest("POST", anonAuthTest.malformedAnonFalse);

                routeF(req, res);

                expect(mockUserSession.authAnonymous).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(400);
            });
            it("should NOT respond (Malformed AuthToken Set)", function() {
                req = createMockRequest("POST", anonAuthTest.malformedAuthTokenSet);

                routeF(req, res);

                expect(mockUserSession.authAnonymous).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(405);
            });
            it("should NOT respond (Malformed Empty)", function() {
                req = createMockRequest("POST", anonAuthTest.malformedEmpty);

                routeF(req, res);

                expect(mockUserSession.authAnonymous).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(400);
            });
        });
        describe("Authenticate Regular User", function() {
            var userAuthTest = {
                wellFormed: {
                    login: "TestLogin",
                    password: "TestPassword"
                },
                wellFormedB64: {
                    login: "TestLogin",
                    b64password: (new Buffer("TestPassword")).toString('base64')
                },
                wellFormedFalseAnon: {
                    anonymous: false,
                    login: "TestLogin",
                    password: "TestPassword"
                },
                wellFormedAuthTokenSet: {
                    authToken: "TestAuthenticationToken",
                    login: "TestLogin",
                    password: "TestPassword"
                },
                malformedTrueAnon: {
                    anonymous: true,
                    login: "TestLogin",
                    password: "TestPassword"
                },
                malformedNoPassword: {
                    login: "TestLogin"
                },
                malformedNoLogin: {
                    password: "TestPassword"
                },
                malformedEmpty: {

                }
            };
            it("should respond with User Document (Well Formed)", function() {
                req = createMockRequest("GET", userAuthTest.wellFormed);

                routeF(req, res);

                expect(mockUserSession.authUser).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should respond with User Document (Well Formed base64 Password)", function() {
                req = createMockRequest("GET", userAuthTest.wellFormedB64);

                routeF(req, res);

                expect(mockUserSession.authUser).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should respond with User Document (Well Formed Anonymous False)", function() {
                req = createMockRequest("GET", userAuthTest.wellFormedFalseAnon);

                routeF(req, res);

                expect(mockUserSession.authUser).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should respond (Malformed AuthToken Set)", function() {
                req = createMockRequest("GET", userAuthTest.wellFormedAuthTokenSet);

                routeF(req, res);

                expect(mockUserSession.authUser).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should NOT respond (Malformed Anonymous True)", function() {
                req = createMockRequest("GET", userAuthTest.malformedTrueAnon);

                routeF(req, res);

                expect(mockUserSession.authUser).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(400);
            });
            it("should NOT respond (Malformed Empty)", function() {
                req = createMockRequest("GET", userAuthTest.malformedEmpty);

                routeF(req, res);

                expect(mockUserSession.authUser).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(400);
            });
        });
        describe("Update User", function() {
            var testAuthToken = "testAuthToken",
                testNewDisplayName = "testNewDisplayName";
            var userUpdateTest = {
                    WFModifyDisplayName: {
                        authToken: testAuthToken,
                        displayName: testNewDisplayName
                    },
                    MFNoAuthToken: {
                        displayName: testNewDisplayName
                    },
                    MFEmpty: {

                    }
                };
            it("should modify user document (Well Formed PUT)", function() {
                req = createMockRequest("PUT", userUpdateTest.WFModifyDisplayName);

                routeF(req, res);

                expect(mockUserManager.updateUser).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should modify user document (Well Formed PATCH)", function() {
                req = createMockRequest("PATCH", userUpdateTest.WFModifyDisplayName);

                routeF(req, res);

                expect(mockUserManager.updateUser).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should NOT modify user document (Malformed No Auth Token PUT)", function() {
                req = createMockRequest("PUT", userUpdateTest.MFNoAuthToken);

                routeF(req, res);

                expect(mockUserManager.updateUser).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(405);
            });
            it("should NOT modify user document (Malformed No Auth Token PATCH)", function() {
                req = createMockRequest("PATCH", userUpdateTest.MFNoAuthToken);

                routeF(req, res);

                expect(mockUserManager.updateUser).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(405);
            });
            it("should NOT modify user document (Malformed Empty PUT)", function() {
                req = createMockRequest("PUT", userUpdateTest.MFEmpty);

                routeF(req, res);

                expect(mockUserManager.updateUser).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(405);
            });
            it("should NOT modify user document (Malformed Empty PATCH)", function() {
                req = createMockRequest("PATCH", userUpdateTest.MFEmpty);

                routeF(req, res);

                expect(mockUserManager.updateUser).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(405);
            });
        });
    });
});
