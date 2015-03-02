"use strict";

define(["models/User", "tests/bind"], function(User) {
    describe("User Model", function() {
        var user;
        beforeEach(function() {
            user = new User();
        });
        it("should set anonymous to false", function() {
            expect(user.isAnonymous()).toBe(false);
        });
        it("should set/get login", function() {
            var testLogin = "test_login";
            user.setLogin(testLogin);
            expect(user.getLogin()).toBe(testLogin);
        });
        it("should NOT set null, undefined, or empty login", function() {
            var nullLogin = null,
                emptyLogin = "",
                undefinedLogin;

            expect(user.setLogin.bind(user, nullLogin)).toThrow();
            expect(user.setLogin.bind(user, emptyLogin)).toThrow();
            expect(user.setLogin.bind(user, undefinedLogin)).toThrow();
        });
        it("should set/get password", function() {
            var testPassword = "test_password";
            expect(user.setPassword.bind(user, testPassword)).not.toThrow();
        });
        it("should NOT set null, undefined, or empty password", function() {
            var nullPassword = null,
                emptyPassword = "",
                undefinedPassword;

            expect(user.setPassword.bind(user, nullPassword)).toThrow();
            expect(user.setPassword.bind(user, emptyPassword)).toThrow();
            expect(user.setPassword.bind(user, undefinedPassword)).toThrow();
        });
        it("should set/get display name", function() {
            var testName = "name_password";
            expect(user.setDisplayName.bind(user, testName)).not.toThrow();
            expect(user.getDisplayName()).toBe(testName);
        });
        it("should NOT set null, undefined, or empty password", function() {
            var nullName = null,
                emptyName = "",
                undefinedName;

            expect(user.setDisplayName.bind(user, nullName)).toThrow();
            expect(user.setDisplayName.bind(user, emptyName)).toThrow();
            expect(user.setDisplayName.bind(user, undefinedName)).toThrow();
        });
    });
});
