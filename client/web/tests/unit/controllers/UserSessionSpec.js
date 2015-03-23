"use strict";

define(["squirejs/Squire"], function(Squire) {
    describe("User Session Controller", function() {
        var usc,
            injector,
            fireFail;

        var mockUser = function(){};
        beforeEach(function(done) {
            fireFail = false;

            mockUser.prototype = jasmine.createSpyObj("user", ["setPassword", "setLogin", "getLogin", "getB64Password", "fetch", "save"]);
            mockUser.extend = jasmine.createSpy("userConstructor").and.callFake(function() {
                return mockUser;   
            });
            var fakePromise = function() {
                var promise = {
                    then: function(cb) {
                        if (!fireFail) {
                            cb({
                                authToken: "GoodToken"   
                            });
                        }
                        return {
                            fail: function(cb) {
                                if (fireFail) {
                                    cb("Failed");
                                }
                            }
                        };
                    }
                };

                return promise;
            };
            mockUser.prototype.fetch.and.callFake(fakePromise);
            mockUser.prototype.save.and.callFake(fakePromise);

            injector = new Squire();

            injector
            .mock('models/User', mockUser)
            .mock('app', {
                mainController: jasmine.createSpyObj("mainController", ["renderHeader", "hideShield"])
            })
            .require(['controllers/UserSession'], function(UserSessionController) {

                usc = new UserSessionController();
                done();
            });

        });
        afterEach(function () {
            usc.off("AuthFailed");
            usc.off("Authenticated");
        });
        it("should authenticate user", function(done) {
            var testLogin = "testLogin",
                testPassword = "testPassword",
                testSave = true;
 
            usc.on("Authenticated", function() {
                expect(usc.getUser()).not.toBeNull();
                expect(usc.isAuthenticated()).toBe(true);
                expect(mockUser.prototype.fetch).toHaveBeenCalledWith({
                    data: jasmine.objectContaining({
                        saveSession: testSave
                    })
                });
                done();
            });
            usc.authUser(testLogin, testPassword, testSave);
        });
        it("should FAIL to authenticate user", function(done) {
            var testLogin = "testLogin",
                testPassword = "testPassword",
                testSave = true;
 
            usc.on("AuthFailed", function() {
                expect(usc.getUser()).toBeNull();
                expect(usc.isAuthenticated()).toBe(false);
                done();
            });
            fireFail = true;
            usc.authUser(testLogin, testPassword, testSave);
        });
        it("should authenticate anonymous", function(done) {
            usc.on("Authenticated", function() {
                expect(usc.getUser()).not.toBeNull();
                expect(mockUser.prototype.save).toHaveBeenCalledWith({});
                expect(usc.isAuthenticated()).toBe(true);
                done();
            });
            usc.authAnonymous(); 
        });
        it("should FAIL to authenticate anonymous", function(done) {
            usc.on("AuthFailed", function() {
                expect(usc.getUser()).toBeNull();
                expect(mockUser.prototype.save).toHaveBeenCalledWith({});
                expect(usc.isAuthenticated()).toBe(false);
                done();
            });
            fireFail = true;
            usc.authAnonymous(); 
        });
        it("should register user", function(done) {
            var testLogin = "newLogin",
                testPassword = "newPassword",
                B64Password = window.btoa(testPassword),
                testSave = true;

            usc.on("Authenticated", function() {
                expect(usc.getUser()).not.toBeNull();
                expect(usc.isAuthenticated()).toBe(true);
                expect(mockUser.prototype.save).toHaveBeenCalledWith(jasmine.objectContaining({
                    login: testLogin,
                    b64password: B64Password,
                    saveSession: testSave
                }), {wait: true});
                done();
            });

            usc.registerUser(testLogin, testPassword, testSave);
        });
        it("should FAIL to register user", function(done) {
            var testLogin = "newLogin",
                testPassword = "newPassword",
                B64Password = window.btoa(testPassword),
                testSave = false;

            usc.on("AuthFailed", function() {
                expect(usc.getUser()).toBeNull();
                expect(usc.isAuthenticated()).toBe(false);
                expect(mockUser.prototype.save).toHaveBeenCalledWith(jasmine.objectContaining({
                    login: testLogin,
                    b64password: B64Password,
                    saveSession: testSave
                }), {wait: true});
                done();
            });
            
            fireFail = true;
            usc.registerUser(testLogin, testPassword, testSave);
        });
    });
});
