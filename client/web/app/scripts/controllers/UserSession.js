define([
    'jquery',
    'backbone',
    'marionette',
    'app',
    'models/AnonymousUser',
    'models/User'
], function (
    $,
    Backbone,
    Marionette,
    App,
    AnonymousUser,
    User
) {
    'use strict';

    var UserSessionController = Marionette.Controller.extend({
        initialize: function() {
            var self = this;

            this._authToken = null;
            this._currentUser = null;

            this._anonCount = 0;
            this.on("Authenticated", this._authenticatedEvent, this);

            window.addEventListener("beforeunload", function() {
                self.logoutSync();
            });
        },
        _authenticatedEvent: function() {
            App.mainController.renderHeader();
            App.mainController.hideShield();
        },
        _setAuthToken: function(token) {
            this._authToken = token;

            $.ajaxSetup({
                data: {
                    authToken: token
                }
            });
        },
        _setUser: function(user) {
            if (this._currentUser && user) {
                this.logout();
            }

            this._currentUser = user;
        },
        _handleAuthPromise: function(promise, model) {
            var self = this;

            promise.then(function (response) {
                if (response.authToken) {
                    self._setUser(model);
                    self._setAuthToken(response.authToken);
                    self.trigger("Authenticated");
                }
            }).fail(function () {
                self.trigger("AuthFailed");
            });
        },
        authAnonymous: function() {
            var anonUser = new AnonymousUser();
            
            this._handleAuthPromise(anonUser.save({}), anonUser);
            return true;
        },
        authUser: function(login, password) {
            var user = new User({});
            user.setLogin(login);
            user.setPassword(password);

            this._handleAuthPromise(user.fetch({
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

            this._handleAuthPromise(newUser.save({}), newUser);
            return true;
        },
        _logout: function(async) {
            var self = this;

            App.mainController.showShield();
            this._currentUser
                .save({
                  status: "offline"
                    },{
                  async: async
                })
                .then(function () {
                    self.trigger("LoggedOff");
                });
            this._currentUser = null;
            this._setAuthToken(null);
        },
        logout: function() {
            this._logout(true);
        },
        logoutSync: function() {
            this._logout(false);
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
