define([
    'backbone',
    'marionette',
    'tpl!/scripts/templates/dashboard/room.html'
], function(
    Backbone,
    Marionette,
    Template) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,

        className: 'pure-u-1-3'
    });
});
