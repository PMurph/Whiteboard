"use strict";


describe("User Session", function() {
    var UserSession = require("../../../src/session/UserSession");
    var userSession, mockUserManager;
    beforeEach(function () {
        mockUserManager = jasmine.createSpyObj("userManager", ["findByLogin", "createAnonymousUser"]);
        userSession = new UserSession(mockUserManager);
    });
    it("should get authentication token from POST request", function() {
        var testToken = "TestAuthToken1";
        var req = {
            method: "POST",
            body: {
                authToken: testToken
            }
        };

        var token = userSession.getRequestToken(req);
        
        expect(token).toBe(testToken);
    });
    it("should get authentication token from GET request", function() {
        var testToken = "TestAuthToken2";
        var req = {
            method: "GET",
            query: {
                authToken: testToken
            }
        };
        var token = userSession.getRequestToken(req);
        
        expect(token).toBe(testToken);
    });
    it("should authenticate regular user", function() {
        var testLogin = "testLogin",
            testPassword = "testPassword",
            dbCallback = function testCB() {};

        userSession.authUser(testLogin, testPassword, dbCallback);
        expect(mockUserManager.findByLogin).toHaveBeenCalledWith(testLogin, testPassword, jasmine.any(Function));
    });
    it("should authenticate anonymous", function() {
        var testDisplayName = "testName",
            testToken = jasmine.any(String),
            testDBCallback = function testCB() {};

        userSession.authAnonymous(testDisplayName, testDBCallback);
        expect(mockUserManager.createAnonymousUser).toHaveBeenCalledWith(testDisplayName, testToken, testDBCallback);
    });
});

