define([
    'jquery',
    'underscore',
    'marionette',
    'behaviors/login',
    'tpl!templates/login.html'
], function(
    $,
    _,
    Marionette,
    LoginBehavior,
    Template
) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,
        ui: {
            statusLabel: "#loginStatusLabel",

            loginTextbox: "#loginText",
            passwordTextbox: "#passwordText",

            loginButton: "#loginUserBtn",
            registerButton: "#registerBtn",
            closeButton: "#closeLoginBtn",

            saveSessionCheck: "#saveSessionCheckbox"
        },
        onShow: function() {
            this.ui.loginTextbox.focus();
        },
        behaviors: {
            login: {
                behaviorClass: LoginBehavior
            }
        }

    });
});
