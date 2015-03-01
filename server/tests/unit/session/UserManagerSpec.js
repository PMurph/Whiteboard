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
    describe("Database Queries", function() {
        it("should create anonymous user document", function() {
            var testName = "TestName",
                testToken = "TestToken",
                testCallback = function testCB() {};

            var userDoc = userManager.createAnonymousUser(testName, testToken, testCallback);
            expect(userDoc.anonymous).toBe(true);
            expect(userDoc.displayName).toBe(testName);
            expect(userDoc.authToken).toBe(testToken);
            expect(userDoc.save.calledWith(testCallback)).toBe(true);
        });
        it("should find user by login and set callback" , function() {
            var testLogin = "TestToken",
                testPassword = "TestPassword",
                testHashPassword = userManager.hashPassword(testPassword),
                testCallback = function testCB() {};
            userManager.findByLogin(testLogin, testPassword, testCallback);
            expect(userModel.findOne).toHaveBeenCalledWith(jasmine.objectContaining({
                login: testLogin,
                passwordHash: testHashPassword
            }));
            expect(queryExec.exec).toHaveBeenCalledWith(testCallback);
        });
        it("should find user by authToken and set callback" , function() {
            var testToken = "TestToken",
                testCallback = function testCB() {};

            userManager.findByAuthToken(testToken, testCallback);
            expect(userModel.findOne).toHaveBeenCalledWith(jasmine.objectContaining({
                authToken: testToken
            }));
            expect(queryExec.exec).toHaveBeenCalledWith(testCallback);
        });
        it("should find user by ID and set callback" , function() {
            var testUserId = "TestID",
                testCallback = function testCB() {};

            userManager.findById(testUserId, testCallback);
            expect(userModel.findOne).toHaveBeenCalledWith(jasmine.objectContaining({
                _id: testUserId
            }));
            expect(queryExec.exec).toHaveBeenCalledWith(testCallback);
        });
    });
});
