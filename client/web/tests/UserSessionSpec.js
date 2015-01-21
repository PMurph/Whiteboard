'use strict';

define(["app"], function(app) {
    describe('Web User Session', function() {
        beforeAll(function () {
            app.start();
        });

        it('should initialize', function() {
            expect(app.userSessionController.isAuthenticated()).toBe(false);
        });
    });
});
