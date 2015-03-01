define([
    'jquery',
    'underscore',
    'marionette',
    'tpl!../templates/master.html'
], function(
    $,
    _,
    Marionette,
    Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        regions: {
            mainContent: '#main-content-region',
            controlsRegion: '#controls-region',
        }
    });
});
