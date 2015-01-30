"use strict";


define(["models/AnonymousUser"], function(AnonUser) {
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
