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
                App.mainController.renderHeader();
                App.mainController.hideSheild();
            }
        },
        _handlePromise: function(promise, model) {
            var self = this;

            promise.then(function (response) {
                if (response.authToken) {
                    self._currentUser = model;
                    self._setAuthToken(response.authToken);
                }
            }).fail(function () {
                self._currentUser = null;
                self._setAuthToken(null);
            });
        },
        authAnonymous: function() {
            var anonUser = new AnonymousUser();
            
            this._handlePromise(anonUser.save({}), anonUser);
            return true;
        },
        authUser: function(login, password) {
            var user = new User({});
            user.setLogin(login);
            user.setPassword(password);

            this._handlePromise(user.fetch({
                data: {
                    login: user.getLogin(),
                    password: user.getPassword()
                }
            }), user);
            return true;
        },
        registerUser: function(login, password, name) {
            var newUser = new User();
            newUser.setLogin(login);
            newUser.setPassword(password);
            newUser.setDisplayName(name);

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
