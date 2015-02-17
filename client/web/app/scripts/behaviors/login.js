
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
            "click @ui.closeButton": "closeLoginWindow"
        },
        loginUser: function() {
            var login = this.view.ui.loginTextbox.val();
            var password = this.view.ui.passwordTextbox.val();

            App.userSessionController.authUser(login, password);
        },
        closeLoginWindow: function() {
            App.mainController.hideShield();
        }
    });

    return LoginBehavior;
});
