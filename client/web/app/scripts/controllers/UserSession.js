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
        _authSuccessF: function(usc) {
            return function (model, response) {
                if (response.authToken) {
                    usc._setAuthToken(response.authToken);
                    usc._currentUser = model;
                }
            };
        },
        _authErrorF: function(usc) {
            return function () {
                usc._setAuthToken(null);
                usc._currentUser = null;
            };
        },
        authAnonymous: function() {
            var anonUser = new AnonymousUser();

            anonUser.save({}, {
                success: this._authSuccessF(this),
                error: this._authErrorF(this)
            });

            return true;
        },
        authUser: function(login, password) {
            var user = new User({
                login: login,
                password: password
            });

            user.fetch({
                success: this._authSuccessF(this),
                error: this._authErrorF(this)
            });

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
