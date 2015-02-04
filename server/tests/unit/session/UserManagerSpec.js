"use strict";

describe("User Manager", function() {
    var UserManager = require("../../../src/session/UserManager"),
        mockMongoDB = require("mongoose-mock"),
        userManager,
        userModel,
        queryExec;
    beforeEach(function() {
        userManager = new UserManager(mockMongoDB);
        userModel = mockMongoDB.model("User");
        spyOn(userModel, "findOne").and.callFake(function() {
            queryExec = jasmine.createSpyObj("Query", ["exec"]); 
            return queryExec;
        });
    });
    describe("database", function() {
        it("should create anonymous user", function() {
            var testName = "TestName",
                testToken = "TestToken",
                testCallback = function testCB() {};
            userManager.createAnonymousUser(testName, testToken, testCallback);
        });
        it("should find user by login and set callback" , function() {
            var testLogin = "TestToken",
                testPassword = "TestPassword",
                testCallback = function testCB() {};
            userManager.findByLogin(testLogin, testPassword, testCallback);
            expect(queryExec.exec).toHaveBeenCalledWith(testCallback);
        });
        it("should find user by authToken and set callback" , function() {
            var testToken = "TestToken",
                testCallback = function testCB() {};

            userManager.findByAuthToken(testToken, testCallback);
            expect(queryExec.exec).toHaveBeenCalledWith(testCallback);
        });
    });
    describe("request routing", function() {
        var routeF,
            res,
            req;
        it("should create proper route function", function() {
            expect(routeF instanceof Function).toBe(true);
            expect(routeF.length).toBe(2);
        });
        beforeEach(function() {
            routeF = userManager.getRouteF();
            
            /* Mock express request and recevie objects */
            req = jasmine.createSpyObj("req", ["method", "body"]);
            res = jasmine.createSpyObj("res", ["send", "sendStatus", "json"]);
            /* Mock userSession */
            userManager.userSession = jasmine.createSpyObj("userSession", ["authUser", "authAnonymous", "getRequestToken"]);
            /* stub db never finds token as were are only testing authentication here */
            spyOn(userManager, "findByAuthToken").and.callFake(function(authToken, callback) {
                callback(null, null);
            });
            userManager.userSession.authAnonymous.and.callFake(function(displayName, callback) {
                callback(null, jasmine.createSpyObj("userDocument", ["toObject"]));   
            });
            userManager.userSession.authUser.and.callFake(function(login, password, callback) {
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
            userManager.userSession.getRequestToken.and.callFake(function() {
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
                
                expect(userManager.userSession.authAnonymous).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should respond with User Document on (Well Formed)", function() {
                req = createMockRequest("POST", anonAuthTest.wellFormed);

                routeF(req, res);

                expect(userManager.userSession.authAnonymous).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should NOT respond (Malformed Anonymous False)", function() {
                req = createMockRequest("POST", anonAuthTest.malformedAnonFalse);

                routeF(req, res);

                expect(userManager.userSession.authAnonymous).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(400);
            });
            it("should NOT respond (Malformed AuthToken Set)", function() {
                req = createMockRequest("POST", anonAuthTest.malformedAuthTokenSet);

                routeF(req, res);

                expect(userManager.userSession.authAnonymous).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(400);
            });
            it("should NOT respond (Malformed Empty)", function() {
                req = createMockRequest("POST", anonAuthTest.malformedEmpty);

                routeF(req, res);

                expect(userManager.userSession.authAnonymous).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(400);
            });
        });
        describe("Authenticate Regular User", function() {
            var userAuthTest = {
                wellFormed: {
                    login: "TestLogin",
                    password: "TestPassword"
                },
                wellFormedFalseAnon: {
                    anonymous: false,
                    login: "TestLogin",
                    password: "TestPassword"
                },
                malformedTrueAnon: {
                    anonymous: true,
                    login: "TestLogin",
                    password: "TestPassword"
                },
                malformedAuthTokenSet: {
                    authToken: "TestAuthenticationToken",
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

                expect(userManager.userSession.authUser).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should respond with User Document (Well Formed Anonymous False)", function() {
                req = createMockRequest("GET", userAuthTest.wellFormedFalseAnon);

                routeF(req, res);

                expect(userManager.userSession.authUser).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
            it("should NOT respond (Malformed Anonymous True)", function() {
                req = createMockRequest("GET", userAuthTest.malformedTrueAnon);

                routeF(req, res);

                expect(userManager.userSession.authUser).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(400);
            });
            it("should NOT respond (Malformed AuthToken Set)", function() {
                req = createMockRequest("GET", userAuthTest.malformedAuthTokenSet);

                routeF(req, res);

                expect(userManager.userSession.authUser).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(400);
            });
            it("should NOT respond (Malformed Empty)", function() {
                req = createMockRequest("GET", userAuthTest.malformedEmpty);

                routeF(req, res);

                expect(userManager.userSession.authUser).not.toHaveBeenCalled();
                expect(res.sendStatus).toHaveBeenCalledWith(400);
            });
        });
    });
});
