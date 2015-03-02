"use strict";


define(["models/AnonymousUser", "tests/bind"], function(AnonUser) {
    describe("AnonymousUser Model", function() {
        var user;
        beforeEach(function() {
            user = new AnonUser();
        });
        it("should set anonymous to true", function() {
            expect(user.isAnonymous()).toBe(true);
        });
        it("should set/get display name", function() {
            var testName = "name_password";
            expect(user.setDisplayName.bind(user,testName)).not.toThrow();
            //Password is encoded as Base64 not plain text
            expect(user.getDisplayName()).toBe(testName);
        });
        it("should NOT set null, undefined, or empty password", function() {
            var nullName = null,
                emptyName = "",
                undefinedName;

            expect(user.setDisplayName.bind(user,nullName)).toThrow();
            expect(user.setDisplayName.bind(user,emptyName)).toThrow();
            expect(user.setDisplayName.bind(user,undefinedName)).toThrow();
        });
    });
});
