
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
            "click @ui.closeButton": "closeLoginWindow"
        },
        closeLoginWindow: function() {
            App.mainController.hideShield();
        }
    });

    return LoginBehavior;
});
