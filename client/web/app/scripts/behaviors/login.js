
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

    var LoginBehavior = Marionette.Behavior.extend({
        initialize: function() {
        },
        events: {
            "click @ui.loginButton": "loginUser",
            "click @ui.registerButton": "registerNewUser",
            "click @ui.closeButton": "closeLoginWindow",
            "click @ui.saveSessionCheck": "saveSessionToggle"
        },
        _setStatus: function(errorString, label) {
            var statusLabel = label || this.view.ui.statusLabel;
            statusLabel.html(errorString);
        },
        loginUser: function() {
            var self = this;

            var login = this.view.ui.loginTextbox.val();
            var password = this.view.ui.passwordTextbox.val();
            var save = this.isSaveSessionChecked();
            var statusLabel = this.view.ui.statusLabel;

            App.userSessionController.once("AuthFailed", function () {
                self._setStatus("Login Failed: The login or password provided could not be authenticated.", statusLabel);
            });
            try {
                App.userSessionController.authUser(login, password, save);
            } catch (e) {
                this._setStatus("Login Failed: " + e);
            }

        },
        registerNewUser: function() {
            console.log("register new user");
        },
        closeLoginWindow: function() {
            App.mainController.hideShield();
        },
        isSaveSessionChecked: function() {
            return this.view.ui.saveSessionCheck.prop("checked");
        },
        saveSessionToggle: function() {
            var checked = this.isSaveSessionChecked();

            if (checked) {
                App.userSessionController.on("Authenticated", App.userSessionController.saveSession);
            } else {
                App.userSessionController.off("Authenticated", App.userSessionController.saveSession);
            }
        }
    });

    return LoginBehavior;
});
