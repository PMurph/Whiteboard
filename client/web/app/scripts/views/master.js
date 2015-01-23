define([
    'jquery',
    'underscore',
    'marionette',
    'tpl!/scripts/templates/master.html'
], function(
    $,
    _,
    Marionette,
    Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        regions: {
            main: '#main-region'
        }

    });
});
