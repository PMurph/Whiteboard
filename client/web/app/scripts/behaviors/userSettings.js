
define([
    './../app',
    'jquery',
    'backbone',
    'marionette'
], function (App,
     $,
     Backbone,
     Marionette
) {
    'use strict';

    var UserSettingsBehavior= Marionette.Behavior.extend({
        initialize: function() {
            
        }
    });

    return UserSettingsBehavior;
});

