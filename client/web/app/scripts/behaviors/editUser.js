
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

    var EditUserBehavior = Marionette.Behavior.extend({
        events: {
            "click @ui.submitButton": "changeDisplayName"
        },
        _setStatus: function(newStatus) {
            this.view.userSettingsView.setStatus(newStatus);
        },
        changeDisplayName: function() {
            var user = App.userSessionController.getUser();
            var newName = this.view.ui.displayNameText.val();
            
            if (user) {
                try {
                    user.setDisplayName(newName);
                } catch (e) {
                    this._setStatus("Invalid: " + e);
                }
            } else {
                throw "No User set in UserSession Controller";
            }
        }
    });

    return EditUserBehavior;
});

