define([
        'backbone'
], function (Backbone) {
    'use strict';

    var User = Backbone.Model.extend({
        url: '/api/user',
        idAttribute: "_id",
        initialize: function () {
            this.set("anonymous", false);
        },
        isAnonymous: function() {
            return this.get("anonymous") === true;
        },
        setLogin: function(login) {
            if(!login || login.length === 0) {
                throw "Login must be set";
                return false;
            }
            this.set("login", login);

            return true;
        },
        getLogin: function() {
            return this.get("login");
        },
        setPassword: function(password) {
            if(!password || password.length === 0) {
                throw "Password cannot be blank";
                return false;
            }

            var b64password = window.btoa(password);
            this.set("password", b64password);

            return true;
        },
        getPassword: function() {
            return this.get("password");
        },
        setDisplayName: function(displayName) {
            if(!displayName || displayName.length === 0) {
                return false;
            }

            this.save({
                displayName: displayName
            });
            return true;
        },
        getDisplayName: function() {
            return this.get("displayName");
        },
        getId: function() {
            return this.get("_id");
        }
    });

    return User;
});
