define([
    'jquery',
    'underscore',
    'marionette',
    'app',
    'behaviors/navbar',
    'tpl!templates/navbar.html'
], function(
    $,
    _,
    Marionette,
    App,
    NavbarBehavior,
    template
) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: function() {
            var user;
            if (App.userSessionController) {
                user = App.userSessionController.getUser();
            }

            if (user) {
                return template({displayName: user.getDisplayName(), anonymous: user.isAnonymous()});
            }else{
                return template({displayName: null, anonymous: null});
            }
        },
        regions: {
            userSettings: "#userSettings"
        },
        ui: {
            b: "body",
            userSettings: "#userSettings",

            loginButton: "#loginButton",
            userSettingsButton: "#userSettingsButton",

            userDisplayName: "#userDisplayName"
        },
        behaviors: {
            NavbarButtons: {
                behaviorClass: NavbarBehavior 
            }
        }
    });
});
