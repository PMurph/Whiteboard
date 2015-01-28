'use strict';

var testResponses = {
    authenticate: {
        anon: {
            success: {
                status: 200,
                responseText: '{"id": 5, "name": "AnonymousTest", "authToken": "testToken"}'
            },
            failure: {
                status: 406,
                responseText: '{}'
            }
        }
    }
};

define(["app", "models/AnonymousUser"], function(App, AnonymousUser) {
    describe('Web User Session', function() {
        beforeEach(function() {
            jasmine.Ajax.install(); 
        });
        afterEach(function() {
            jasmine.Ajax.uninstall(); 
        });
        it('should initalize to unauthenticated', function() {
            expect(App.userSessionController.isAuthenticated()).toBe(false);
        });
        describe('should authenticate anonymous user', function() {
            var request;
            beforeEach(function() {
                App.userSessionController.authAnonymous();

                request = jasmine.Ajax.requests.mostRecent();

                expect(request.url).toBe('/api/user');
                expect(request.method).toBe('POST');
            });
            describe('on success', function() {
                beforeEach(function() {
                    spyOn(App.userSessionController, '_setAuthToken').and.callThrough();
                    request.respondWith(testResponses.authenticate.anon.success);
                });
                
                it('set authentication token', function() {
                    expect(App.userSessionController.isAuthenticated()).toBe(true);
                    expect(App.userSessionController._setAuthToken).toHaveBeenCalledWith('testToken');
                });
                it('set user', function() {
                    expect(App.userSessionController.getUser() instanceof AnonymousUser).toBe(true);
                    expect(App.userSessionController.getUser().id).toBe(5);
                    expect(App.userSessionController.getUser().get("name")).toBe("AnonymousTest");
                });
            });
            describe('on failure', function() {
                beforeEach(function() {
                    spyOn(App.userSessionController, '_setAuthToken').and.callThrough();
                    request.respondWith(testResponses.authenticate.anon.failure);
                });
                
                it('set authentication token to null', function() {
                    expect(App.userSessionController.isAuthenticated()).toBe(false);
                    expect(App.userSessionController._setAuthToken).toHaveBeenCalledWith(null);
                });
            });
        });
    });
});
