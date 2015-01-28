define([
        './../app',
        'jquery',
        'backbone',
        'marionette',
        'models/AnonymousUser',
        'models/User'
], function (App,
     $,
     Backbone,
     Marionette,
     AnonymousUser,
     User) {
    'use strict';

    var UserSessionController = Marionette.Controller.extend({
        initialize: function() {
            this._authToken = null;
            this._currentUser = null;

            this._anonCount = 0;
        },
        _setAuthToken: function(token) {
            this._authToken = token;
            $.ajaxSetup({
                data: {
                    authToken: token
                }
            });

            if(token) {
                App.mainController.dashboard();
            }
        },
        _handlePromise: function(promise, model) {
            var self = this;

            promise.then(function (response) {
                if (response.authToken) {
                    self._setAuthToken(response.authToken);
                    self._currentUser = model;
                }
            }).fail(function () {
                self._setAuthToken(null);
                self._currentUser = null;
            });
        },
        authAnonymous: function() {
            var anonUser = new AnonymousUser();
            
            this._handlePromise(anonUser.save({}), anonUser);
            return true;
        },
        authUser: function(login, password) {
            var user = new User({
                login: login,
                password: password
            });

            this._handlePromise(user.fetch(), user);
            return true;
        },
        registerUser: function(login, password, name) {
            var newUser = new User({
                login: login,
                password: password,
                name: name
            });

            this._handlePromise(newUser.save({}), newUser);
            return true;
        },
        getUser: function() {
            return this._currentUser;
        },
        isAuthenticated: function() {
            return (this._authToken !== null);
        }

    });

    return UserSessionController;
});
