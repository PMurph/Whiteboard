'use strict';


define(["app", "models/AnonymousUser", "models/User"], function(App, AnonymousUser, User) {
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
            },
            regular: {
                success: {
                    status: 200,
                    responseText: '{"id": 6, "name": "Regular User", "authToken": "testToken2"}'
                },
                failure: {
                    status: 400,
                    responseText: '{}'
                }
            }
        }
    };
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
                    spyOn(App.mainController, 'dashboard');
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
        describe('should authenticate regular user', function() {
            var request;
            beforeEach(function() {
                App.userSessionController.authUser("TestLogin", "TestPassword");

                request = jasmine.Ajax.requests.mostRecent();
            });
            describe('setup GET query parameters', function() {
                var urlParts,
                    urlPath,
                    urlParams;
                beforeEach(function() {
                    urlParts = request.url.split("?");
                    urlPath = urlParts[0];
                    urlParams = urlParts[1];
                });
                it('should set url path', function() {
                    expect(urlPath).toBe("/api/user");
                    expect(request.method).toBe('GET');
                });
                it('set query parameters (Login and Password)', function() {
                    var queryParams = urlParams.split('&');
                    var query = {};

                    for (var i in queryParams) {
                        var param = queryParams[i];
                        var keyValue = param.split('=');
                        var key = keyValue[0];
                        var value = keyValue[1];

                        query[key] = value;
                    }
                    expect(query.login).toBe("TestLogin");
                    expect(query.password).toBe(window.btoa("TestPassword"));
                });
            });
            describe('on success', function() {
                beforeEach(function() {
                    spyOn(App.mainController, 'dashboard');
                    spyOn(App.userSessionController, '_setAuthToken').and.callThrough();
                    request.respondWith(testResponses.authenticate.regular.success);
                });
                it('set authentication token', function() {
                    expect(App.userSessionController.isAuthenticated()).toBe(true);
                    expect(App.userSessionController._setAuthToken).toHaveBeenCalledWith('testToken2');
                });
                it('set user', function() {
                    expect(App.userSessionController.getUser() instanceof User).toBe(true);
                    expect(App.userSessionController.getUser().id).toBe(6);
                    expect(App.userSessionController.getUser().get("name")).toBe("Regular User");
                });
            });
            describe('on failure', function() {
                beforeEach(function() {
                    spyOn(App.userSessionController, '_setAuthToken').and.callThrough();
                    request.respondWith(testResponses.authenticate.regular.failure);
                });
                it('set authentication token to null', function() {
                    expect(App.userSessionController.isAuthenticated()).toBe(false);
                    expect(App.userSessionController._setAuthToken).toHaveBeenCalledWith(null);
                });
            });
        });
    });
});
