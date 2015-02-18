define([
    'jquery',
    'underscore',
    'marionette',
    'app',
    'tpl!templates/master.html'
], function(
    $,
    _,
    Marionette,
    App,
    Template
) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,
        ui: {
            appShield: '#app-shield',
            centerBox: '#center-box'
        },
        regions: {
            header: '#header',
            mainContent: '#main-content-region',
            centerBox: '#center-box'
        }
    });
});
