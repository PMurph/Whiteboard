
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
            "click @ui.closeButton": "closeLoginWindow",
            "click @ui.saveSessionCheck": "saveSessionToggle"
        },
        loginUser: function() {
            var login = this.view.ui.loginTextbox.val();
            var password = this.view.ui.passwordTextbox.val();

            App.userSessionController.authUser(login, password);
        },
        closeLoginWindow: function() {
            App.mainController.hideShield();
        },
        saveSessionToggle: function() {
            var checked = this.view.ui.saveSessionCheck.prop("checked");
            if (checked) {
                App.userSessionController.on("Authenticated", App.userSessionController.saveSession);
            } else {
                App.userSessionController.off("Authenticated", App.userSessionController.saveSession);
            }
        }
    });

    return LoginBehavior;
});
