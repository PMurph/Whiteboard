
define([
    'jquery',
    'backbone',
    'marionette',
    'app'
], function (
     $,
     Backbone,
     Marionette,

     App
) {
    'use strict';

    var EditUserBehavior = Marionette.Behavior.extend({
        initialize: function() {
            this.menuId = this.view.options.menuId;
        },
        events: function() {
            var events = {};

            if (this.menuId === "modifyDisplayName") {
                events["click @ui.submitButton"] = "changeDisplayName";
            } else if (this.menuId === "modifyUsername") {
                events["click @ui.submitButton"] = "changeUsername";   
            } else if (this.menuId === "modifyPassword") {
                events["click @ui.submitButton"] = "changePassword";   
            }

            return events;
        },
        _setStatus: function(newStatus) {
            this.view.userSettingsBehaviour.setStatus(newStatus);
        },
        _getUser: function() {
            return App.userSessionController.getUser();
        },
        clearStatus: function() {
            this._setStatus("");

            return false;
        },
        changeDisplayName: function() {
            var user = this._getUser();
            var newName = this.view.ui.displayNameText.val();
            this.clearStatus();
            
            try {
                user.setDisplayName(newName);
            } catch (e) {
                this._setStatus("Invalid: " + e);
            }
        },
        changeUsername: function() {
            var user = this._getUser();
            var newLogin = this.view.ui.usernameText.val();
            this.clearStatus();
            
            try {
                var self = this;
                user.setLogin(newLogin)
                    .then(function () {
                        
                    })
                    .fail(function (a, b, c) {
                        var aa = a;
                        self._setStatus("Username/Login failed to set: ");
                    });
            } catch (e) {
                this._setStatus("Invalid: " + e);
            }
        },
        changePassword: function() {
            var user = this._getUser();
            this.clearStatus();

            if (this.view.ui.password1Text.val() !== this.view.ui.password2Text.val()){
                this._setStatus("Invalid: The passwords entered did not match");
                return;
            }
            var newPassword = this.view.ui.password1Text.val();
            
            try {
                user.setPassword(newPassword);
            } catch (e) {
                this._setStatus("Invalid: " + e);
            }
        }
    });

    return EditUserBehavior;
});

