
define([
    'jquery',
    'underscore',
    'marionette',
    'app',
    'tpl!templates/userSettings.html'
], function(
    $,
    _,
    Marionette,
    App,
    template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: template,
        ui: {
            
        }
    });

});
