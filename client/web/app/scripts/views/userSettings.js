
define([
    'jquery',
    'underscore',
    'marionette',

    'app',

    'behaviors/userSettings',

    'tpl!templates/userSettings.html'
], function(
    $,
    _,
    Marionette,

    App,

    UserSettings,

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
                return template({isAnonymous: user.isAnonymous()});
            }
        },
        regions: {
            subMenu: "#settingsSubMenu"
        },
        ui: {
            changeDisplayNameButton: "#changeDisplayNameButton",
            changeLoginButton: "#chnageLoginButton",
            subMenu: "#settingsSubMenu",
            userSettings: "#userSettings"
        },
        behaviors: {
            userSettings: {
                behaviorClass: UserSettings
            }
        }
    });

});
