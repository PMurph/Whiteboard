define([
    'backbone',
    'marionette',
    'tpl!templates/dashboard/room.html'
], function(
    Backbone,
    Marionette,
    template
) {
    'use strict';

    return Marionette.ItemView.extend({
        template: template,

        className: 'pure-u-1-3'
    });
});
