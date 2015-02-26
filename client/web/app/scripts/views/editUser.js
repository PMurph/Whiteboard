
define([
    'jquery',
    'underscore',
    'marionette',

    'app',

    'behaviors/editUser'
], function(
    $,
    _,
    Marionette,

    App,

    EditUser
) {
    'use strict';

    return Marionette.ItemView.extend({
        initialize: function(options) {
            this.userSettingsBehaviour = options.userSettingsBehaviour;
        },
        ui: {
            displayNameText: "#displayNameText",
            password1Text: "#password1Text",
            password2Text: "#password2Text",
            usernameText: "#usernameText",
            submitButton: "#submitButton"
        },
        behaviors: {
            editUser: {
                behaviorClass: EditUser
            }
        }
    });

});
