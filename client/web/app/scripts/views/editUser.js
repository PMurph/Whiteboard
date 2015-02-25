
define([
    'jquery',
    'underscore',
    'marionette',

    'app',

    'behaviors/editUser',

    'tpl!templates/settings/editDisplayName.html'
], function(
    $,
    _,
    Marionette,

    App,

    EditUser,

    displayNameTemplate
) {
    'use strict';

    return Marionette.ItemView.extend({
        initialize: function(options) {
            this.userSettingsView = options.userSettingsView;
        },
        template: function() {
            return displayNameTemplate();
        },
        ui: {
            displayNameText: "#displayNameText",
            submitButton: "#submitButton"
        },
        behaviors: {
            editUser: {
                behaviorClass: EditUser
            }
        }
    });

});
