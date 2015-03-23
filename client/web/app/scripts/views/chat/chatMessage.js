define([
    'underscore',
    'marionette',
    'tpl!templates/chat/chatMessage.html'
], function(
    _,
    Marionette,
    Template
) {
    'use strict';

    return Marionette.ItemView.extend({
        getTemplate: function() {
            if (this.model.get('name') === undefined) {
                return _.template('<%= message %>');
            } else {
                return Template;
            }
        }
    });
});
