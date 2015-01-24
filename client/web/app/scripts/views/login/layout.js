define([
    'jquery',
    'underscore',
    'marionette',
    'tpl!/scripts/templates/login/layout.html'
], function(
    $,
    _,
    Marionette,
    Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template
    });
});
