"use strict";


define(["models/User"], function(User) {
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
            expect(user.setLogin(testLogin)).toBe(true);
            expect(user.getLogin()).toBe(testLogin);
        });
        it("should NOT set null, undefined, or empty login", function() {
            var nullLogin = null,
                emptyLogin = "",
                undefinedLogin;

            expect(user.setLogin(nullLogin)).toBe(false);
            expect(user.setLogin(emptyLogin)).toBe(false);
            expect(user.setLogin(undefinedLogin)).toBe(false);
        });
        it("should set/get password", function() {
            var testPassword = "test_password";
            expect(user.setPassword(testPassword)).toBe(true);
            //Password is encoded as Base64 not plain text
            expect(user.getPassword()).toBe(window.btoa(testPassword));
        });
        it("should NOT set null, undefined, or empty password", function() {
            var nullPassword = null,
                emptyPassword = "",
                undefinedPassword;

            expect(user.setPassword(nullPassword)).toBe(false);
            expect(user.setPassword(emptyPassword)).toBe(false);
            expect(user.setPassword(undefinedPassword)).toBe(false);
        });
        it("should set/get display name", function() {
            var testName = "name_password";
            expect(user.setDisplayName(testName)).toBe(true);
            //Password is encoded as Base64 not plain text
            expect(user.getDisplayName()).toBe(testName);
        });
        it("should NOT set null, undefined, or empty password", function() {
            var nullName = null,
                emptyName = "",
                undefinedName;

            expect(user.setDisplayName(nullName)).toBe(false);
            expect(user.setDisplayName(emptyName)).toBe(false);
            expect(user.setDisplayName(undefinedName)).toBe(false);
        });
    });
});
