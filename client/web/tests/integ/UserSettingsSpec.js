
define(["app"], function(App) {
    'use strict';
    describe("User Settings/Options", function () {
        var request;
        beforeEach(function() {
            jasmine.Ajax.install();
        });
        afterEach(function() {
            jasmine.Ajax.uninstall();
        });
        describe("Anonymous User", function() {
            beforeEach(function(done) {
                App.userSessionController.authAnonymous();
                App.userSessionController.on("Authenticated", function() {
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    contentType: "application/json",
                    responseText: '{"_id": 5,"displayName": "Anonymous Test","authToken": "ValidTestToken", "anonymous": true}'
                });
            });
            it("should set/get display name (Valid Name)", function() {
                var newName = "New Anonymous Display Name";
                var user = App.userSessionController.getUser();
                
                expect(user).not.toBe(null);
                expect(user.getDisplayName()).toBe("Anonymous Test");
                user.setDisplayName(newName);
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    responseText: {
                        "displayName": newName
                    }
                });

                expect(user.getDisplayName()).toBe(newName);
            });
        });
        describe("User", function() {
            beforeEach(function(done) {
                App.userSessionController.authUser("test", "testPassword");
                App.userSessionController.on("Authenticated", function() {
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    responseText: '{"_id": 5,"displayName": "Test","authToken": "ValidTestToken", "anonymous":false}'
                });
            });
            it("should set/get display name (Valid Name)", function() {
                var newName = "New Display Name";
                var user = App.userSessionController.getUser();
                
                expect(user).not.toBe(null);
                expect(user.getDisplayName()).toBe("Test");
                user.setDisplayName(newName);
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    responseText: {
                        "displayName": newName
                    }
                });

                expect(user.getDisplayName()).toBe(newName);
            });
        });

    });
});
