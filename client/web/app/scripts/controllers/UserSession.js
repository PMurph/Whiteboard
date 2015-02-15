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
            this._authToken = null;
            this._currentUser = null;

            this._anonCount = 0;
            this.on("Authenticated", this._authenticatedEvent, this);
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
        _handlePromise: function(promise, model) {
            var self = this;

            promise.then(function (response) {
                if (response.authToken) {
                    self._currentUser = model;
                    self._setAuthToken(response.authToken);
                    self.trigger("Authenticated");
                }
            }).fail(function () {
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
