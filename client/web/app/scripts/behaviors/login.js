
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
            "click @ui.saveSessionCheck": "saveSessionToggle",
            "keypress @ui.loginTextbox": "checkForEnter",
            "keypress @ui.passwordTextbox": "checkForEnter"
        },
        _setStatus: function(errorString) {
            var statusLabel = this.view.ui.statusLabel;
            statusLabel.html(errorString);
        },
        _setDisabled: function(value) {
            var loginTxt = this.view.ui.loginTextbox,
                passwordTxt = this.view.ui.passwordTextbox,
                saveCheckbox = this.view.ui.saveSessionCheck,
                loginBtn = this.view.ui.loginButton,
                registerBtn = this.view.ui.registerButton;

            loginTxt.prop("disabled", value);
            passwordTxt.prop("disabled", value);
            saveCheckbox.prop("disabled", value);
            loginBtn.prop("disabled", value);
            registerBtn.prop("disabled", value);
        },
        checkForEnter: function(event) {
            var ENTER_KEY = 13;
            if(event.which === ENTER_KEY) {
                this.loginUser();
            }
        },
        loginUser: function() {
            try {
                var self = this;

                var loginTxt = this.view.ui.loginTextbox,
                    login = loginTxt.val(),
                    passwordTxt = this.view.ui.passwordTextbox,
                    password = passwordTxt.val(),
                    save = this.isSaveSessionChecked();

                App.userSessionController.once("AuthFailed", function () {
                    self._setStatus("Login Failed: The login or password provided could not be authenticated.");
                    self._setDisabled(false);
                });

                this._setStatus("<img src='images/ellipsis_small.svg'></img>");
                this._setDisabled(true);

                App.userSessionController.authUser(login, password, save);
            } catch (e) {
                App.userSessionController.off("AuthFailed");
                this._setStatus("Login Failed: " + e);
                this._setDisabled(false);
            }

        },
        registerNewUser: function() {
            try {
                var self = this;

                var loginTxt = this.view.ui.loginTextbox,
                    login = loginTxt.val(),
                    passwordTxt = this.view.ui.passwordTextbox,
                    password = passwordTxt.val(),
                    save = this.isSaveSessionChecked();

                App.userSessionController.once("AuthFailed", function (error) {
                    self._setStatus("Registration Failed: " + error);
                    self._setDisabled(false);
                });

                this._setStatus("<img src='images/ellipsis_small.svg'></img>");
                this._setDisabled(true);

                App.userSessionController.registerUser(login, password, save);
            } catch (e) {
                App.userSessionController.off("AuthFailed");
                this._setStatus("Registration Failed: " + e);
                this._setDisabled(false);
            }
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
