
define([
    'jquery',
    'backbone',
    'marionette',
    'app',
    'views/editUser'
], function (
     $,
     Backbone,
     Marionette,

     App,

     EditUserView
) {
    'use strict';

    var EditUserBehavior = Marionette.Behavior.extend({
        initialize: function() {
            
        },
        events: {
            "click @ui.submitButton": "changeDisplayName"
        },
        changeDisplayName: function() {
            var user = App.userSessionController.getUser();
            var newName = this.view.ui.displayNameText.val();
            
            console.log("fefwefwef");

            if (user) {
                user.setDisplayName(newName);
            } else {
                throw "No User set in UserSession Controller";
            }
        }
    });

    return EditUserBehavior;
});

