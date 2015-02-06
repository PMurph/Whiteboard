define([
    'jquery',
    'underscore',
    'marionette',
    'tpl!templates/login/layout.html'
], function(
    $,
    _,
    Marionette,
    Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        className: 'content-container'
    });
});
