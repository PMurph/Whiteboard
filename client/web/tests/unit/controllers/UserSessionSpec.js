"use strict";

define(["squirejs/Squire"], function(Squire) {
    describe("User Session Controller", function() {
        var usc,
            injector;

        var mockUser = function(){};
        beforeEach(function(done) {
            mockUser.prototype = jasmine.createSpyObj("user", ["setPassword", "setLogin", "getLogin", "getB64Password", "fetch", "save"]);
            mockUser.extend = jasmine.createSpy("userConstructor").and.callFake(function() {
                return mockUser;   
            });
            var fakePromise = function() {
                var promise = {
                    then: function(cb) {
                        cb({
                            authToken: "GoodToken"   
                        });

                        return {
                            fail: jasmine.createSpy("fail")
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
        it("should authenticate user", function(done) {
            var testLogin = "testLogin",
                testPassword = "testPassword",
                testSave = true;
 
            usc.on("Authenticated", function() {
                expect(usc.getUser()).not.toBe(null);
                expect(mockUser.prototype.fetch).toHaveBeenCalledWith({
                    data: jasmine.objectContaining({
                        saveSession: testSave
                    })
                });
                done();
            });
            usc.authUser(testLogin, testPassword, testSave);
        });
        it("should authenticate anonymous", function(done) {
            usc.on("Authenticated", function() {
                expect(usc.getUser()).not.toBe(null);
                expect(mockUser.prototype.save).toHaveBeenCalledWith({});
                done();
            });
            usc.authAnonymous(); 
        });
    });
});
