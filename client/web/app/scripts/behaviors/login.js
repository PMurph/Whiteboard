
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
            var save = this.isSaveSessionChecked();

            App.userSessionController.authUser(login, password, save);
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
