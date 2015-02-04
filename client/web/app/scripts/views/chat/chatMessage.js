define([
    'marionette',
    'tpl!/scripts/templates/chat/chatMessage.html'
], function(
    Marionette,
    Template) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,
    });
});
