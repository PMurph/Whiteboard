
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
            configBox: "#subConfigBox"
        },
        ui: {
            changeDisplayNameButton: "#changeDisplayNameButton",
            changeLoginButton: "#changeLoginButton",
            subMenu: "#settingsSubMenu",
            userSettings: "#userSettings",
            subStatusLabel: "#subStatusLabel"
        },
        behaviors: {
            userSettings: {
                behaviorClass: UserSettings
            }
        },
        setStatus: function(newStatus) {
            var status = newStatus.replace(/ /g, '\u00a0');
            this.ui.subStatusLabel.html(status);
        }
    });

});
