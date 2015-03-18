
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
            var testDisplayName = "Anonymous Test";
            beforeEach(function(done) {
                App.userSessionController.authAnonymous();
                App.userSessionController.on("Authenticated", function() {
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    contentType: "application/json",
                    responseText: '{"_id": 5,"displayName": "'  + testDisplayName+ '","authToken": "ValidTestToken", "anonymous": true}'
                });
            });
            it("should set/get display name (Valid Name)", function() {
                var newName = "New Anonymous Display Name";
                var user = App.userSessionController.getUser();
                
                expect(user).not.toBe(null);
                expect(user.getDisplayName()).toBe(testDisplayName);
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
            it("should NOT set/get display name (Invalid Name)", function() {
                var newName = "BAD Display Name";
                var user = App.userSessionController.getUser();
                
                expect(user).not.toBe(null);
                expect(user.getDisplayName()).toBe(testDisplayName);
                user.setDisplayName(newName);
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 400,
                    responseText: "Bad name"
                });

                expect(user.getDisplayName()).toBe(testDisplayName);
            });
        });
        describe("User", function() {
            var user,
                testDisplayName = "TestDP",
                testLogin = "TestLogin";
            beforeEach(function(done) {
                App.userSessionController.authUser("test", "testPassword");
                App.userSessionController.on("Authenticated", function() {
                    user = App.userSessionController.getUser();
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    responseText: '{"_id": 5,"displayName": "' + testDisplayName + '","authToken": "ValidTestToken", "login": "' + testLogin + '", "anonymous":false}'
                });
            });
            it("should set/get display name (Valid Name)", function() {
                var newName = "New Display Name";
                
                expect(user).not.toBe(null);
                expect(user.getDisplayName()).toBe(testDisplayName);
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
            it("should NOT set/get display name (Invalid Name)", function() {
                var newName = "Invalid<name></name>";
                
                expect(user).not.toBe(null);
                expect(user.getDisplayName()).toBe(testDisplayName);
                user.setDisplayName(newName);
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 400,
                    responseText: "Invalid"
                });

                expect(user.getDisplayName()).toBe(testDisplayName);
            });
            it("should set/get login/username (Valid Login)", function() {
                var newName = "NewLogin";
                
                expect(user).not.toBe(null);
                expect(user.getLogin()).toBe(testLogin);
                user.setLogin(newName);
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    responseText: {
                        "login": newName
                    }
                });

                expect(user.getLogin()).toBe(newName);
            });
            it("should NOT set/get login/username (Invalid Login)", function() {
                var newName = "NewLogin";
                
                expect(user).not.toBe(null);
                expect(user.getLogin()).toBe(testLogin);
                user.setLogin(newName);
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 400,
                    responseText: "Username taken already"
                });

                expect(user.getLogin()).toBe(testLogin);
            });
            it("should set password (Valid Password)", function() {
                var newPassword = "New Password",
                    b64pass = window.btoa(newPassword);
                
                expect(user).not.toBe(null);
                user.setPassword(newPassword);
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    responseText: {
                        "Password": newPassword 
                    }
                });

                expect(user.getB64Password()).toBe(b64pass);
            });
            it("should NOT set password (Invalid Password)", function() {
                var newPassword = "b",
                    b64pass = window.btoa(newPassword);
                
                expect(user).not.toBe(null);
                user.setPassword(newPassword);
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    status: 400,
                    responseText: "Password is not secure enough"
                });

                expect(user.getB64Password()).not.toBe(b64pass);
            });
        });
    });
});
