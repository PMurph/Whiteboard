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
                throw "Login/Username must be set";
            }
             
            if (!this.isNew()) {
                return this.save({
                    login: login
                });
            }else{
                this.set("login", login);
            }
        },
        getLogin: function() {
            return this.get("login");
        },
        setPassword: function(password) {
            if(!password || password.length === 0) {
                throw "Password cannot be blank";
            }

            var b64password = window.btoa(password);
            
            if (!this.isNew()) {
                return this.save({
                    password: b64password
                });
            }else{
                this.set("b64password", b64password);
            }
        },
        getB64Password: function() {
            return this.get("b64password");
        },
        setDisplayName: function(displayName) {
            if(!displayName || displayName.length === 0) {
                throw "Display name cannot be blank";
            }

            if (!this.isNew()) {
                return this.save({
                    displayName: displayName
                });
            }else{
                this.set("displayName", displayName);
            }
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
