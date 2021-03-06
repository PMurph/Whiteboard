define([
    'jquery',
    'backbone',
    'marionette',
    'app',
    'vent',
    'controllers/SocketController',
    'models/AnonymousUser',
    'models/User'
], function (
    $,
    Backbone,
    Marionette,
    App,
    vent,
    SocketController,
    AnonymousUser,
    User
) {
    'use strict';

    var UserSessionController = Marionette.Object.extend({
        initialize: function() {
            this._authToken = null;
            this._currentUser = null;

            SocketController.userSession = this;

            this._setupWindowEvents();
            this._setupObjectEvents();
        },
        _setupObjectEvents: function() {
            this.on("Authenticated", this._authenticatedEvent, this);
            this.on("PreLoggedOff", this._preLoggedOffEvent, this);
        },
        _setupWindowEvents: function() {
            var self = this;

            window.addEventListener("beforeunload", function() {
                if(self.isAuthenticated() && self._currentUser) {
                    self.logoutSync();
                }
            });
            document.addEventListener("visibilitychange", function() {
                if(self.isAuthenticated() && self._currentUser) {
                    var status = document.visibilityState === "visible" ? "online" : "away";
                    self.setUserStatus(status, false);
                }
            });
        },
        _preLoggedOffEvent: function() {
            if (App.mainController.inRoom()) {
                vent.trigger("leaveRoom");
            }
        },
        _authenticatedEvent: function() {
            App.mainController.renderHeader(this._currentUser);

            if (App.mainController.inDashboard()) {
                App.mainController.dashboard();
            }else if (App.mainController.inRoom()) {
                App.mainController.room();
            }
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
            if (this._currentUser && user && (this._currentUser !== user)) {
                this.logout();
            }

            this._currentUser = user;
        },
        _setUserById: function(userId, callback) {
            if (!userId) {
                throw "Error: Invalid user id.";
            }
            if (this._currentUser) {
                this.logout();
            }

            this._currentUser = new User({_id: userId});
            this._currentUser
                .fetch({
                    async: false,
                    data: {
                        _id: userId
                    }
                })
                .then(function() {
                   callback(null);
                })
                .fail(function() {
                    callback("failed to set user by id: " + userId);
                });
        },
        _handleAuthPromise: function(promise, model) {
            var self = this;

            promise.then(function (response) {
                if (response.authToken) {
                    self.trigger("PreLoggedOff");
                    self._setUser(model);
                    self._setAuthToken(response.authToken);
                    self.trigger("Authenticated");
                    self.off("AuthFailed");
                }
            }).fail(function (xhr) {
                self.trigger("AuthFailed", xhr.responseText);
            });
        },
        authAnonymous: function() {
            var anonUser = new AnonymousUser();

            this._handleAuthPromise(anonUser.save({}), anonUser);
            return true;
        },
        authUser: function(login, password, saveSession) {
            var user = new User({});
            var save = saveSession || false;
            var promise;

            try {
                user.setLogin(login);
                user.setPassword(password);
            } catch (e) {
                throw e;
            }

            promise = user.fetch({
                data: {
                    login: user.getLogin(),
                    b64password: user.getB64Password(),
                    saveSession: save
                }
            });

            this._handleAuthPromise(promise, user);
        },
        registerUser: function(login, password, saveSession) {
            var save = saveSession || false;
            //We can convert anonymous user to non-anonymous and call it a registration
            var newUser = (this._currentUser) ? this._currentUser : new User();
            

            var b64pass = window.btoa(password);
            var promise = newUser.save({
                login: login,
                b64password: b64pass,
                anonymous: false,
                saveSession: save
            },{
                wait: true
            });

            this._handleAuthPromise(promise, newUser);
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
                   wait: true,
                   async: async
                });
            }else{
               throw "Cannot set user status while unauthenticatd.";
            }

            return promise;
        },
        setSaveSession: function(saveSession) {
            var self = this;

            if (this.isAuthenticated()) {
                this._currentUser.save({
                    authToken: this._authToken,
                    saveSession: saveSession,
                },{
                    patch: true,
                    wait: true
                }).then(function () {
                   self.clearSavedSession();
                });
            }
        },
        findSavedSession: function() {
            var self = this;

            var savedToken, savedUserId;

            savedToken = localStorage.getItem("session::AuthToken");
            savedUserId = localStorage.getItem("session::userId");

            if (savedUserId && savedToken) {
                App.mainController.setStatusBox("Restoring Saved Session", "ellipsis_big.svg");
                this._setAuthToken(savedToken);
                this._setUserById(savedUserId, function(err) {
                    if (err) {
                        console.error("The saved authentication token is invalid. Using anonymous account.");
                        self.clearSavedSession();
                        self._setAuthToken(null);
                        self._setUser(null);
                    }else{
                        self.trigger("Authenticated");
                    }
                });

                return true;
            }
            return false;
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
            App.mainController.setStatusBox("Signing Out", "ellipsis_big.svg");

            xhr = this.setUserStatus("offline", async);
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
