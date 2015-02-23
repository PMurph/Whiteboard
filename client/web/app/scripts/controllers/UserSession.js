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

    var UserSessionController = Marionette.Object.extend({
        initialize: function() {
            this._authToken = null;
            this._currentUser = null;
            
            this._setupWindowEvents();
            this._setupObjectEvents();    
        },
        _setupObjectEvents: function() {
            this.on("Authenticated", this._authenticatedEvent, this);
        },
        _setupWindowEvents: function() {
            var self = this;

            window.addEventListener("beforeunload", function() {
                if(self.isAuthenticated && self._currentUser) {
                    self.logoutSync();
                }
            });
            document.addEventListener("visibilitychange", function(event) {
                if(self.isAuthenticated() && self._currentUser) {
                    var status = document.visibilityState === "visible" ? "online" : "away";
                    self.setUserStatus(status, false);
                }
            });
        },
        _authenticatedEvent: function() {
            App.mainController.renderHeader(this._currentUser);
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
        _setUserById: function(userId) {
            var self = this;

            if (this._currentUser && user) {
                this.logout();
            }

            this._currentUser = new User({_id: userId});
            this._currentUser
                .fetch({
                    async: false
                })
                .then(function() {
                    
                })
                .fail(function() {
                    self.clearSavedSession();  
                    self._setAuthToken(null);
                    self._setUser(null);
                });
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
        findSavedSession: function() {
            var savedToken, savedUserId;

            savedToken = localStorage.getItem("session::AuthToken");
            savedUserId = localStorage.getItem("session::userId");

            if (savedUserId && savedToken) {
                this._setAuthToken(savedToken);
                this._setUserById(savedUserId);
                this.trigger("Authenticated");

                return true;
            }
            return false;
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
        getUserStatus: function() {
            if (this._currentUser) {
                return this._currentUser.get("status");
            }

            return false;
        },
        setUserStatus: function(newStatus, async) {
            var promise = null;

            if(this.isAuthenticated()) {
                promise = this._currentUser
                .save({
                   authToken: this._authToken,
                   status: newStatus
                },{
                   patch: true,
                   async: async
                });
            }else{
               throw "Cannot set user status while unauthenticatd.";
            }

            return promise;
        },
        saveSession: function() {
            localStorage.setItem("session::AuthToken", this._authToken);
            localStorage.setItem("session::userId", this._currentUser.getId());
        },
        clearSavedSession: function() {
            localStorage.removeItem("session::AuthToken");
            localStorage.removeItem("session::userId");
        },
        _logout: function(async) {
            var self = this;
            var xhr;

            App.mainController.showShield();
            xhr = this.setUserStatus("offline", async)
            if (xhr) {
                xhr.then(function () {
                    self.trigger("LoggedOff");
                });
            }
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
