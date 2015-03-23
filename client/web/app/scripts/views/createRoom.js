
define([
    'app',
    'marionette',
    'tpl!templates/createRoom.html'
], function(
    App,
    Marionette,
    Template
) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,
        className: 'content-container',
    });
});
