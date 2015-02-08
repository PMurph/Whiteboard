define([
    'backbone',
    'models/chatMessage'
], function(
    Backbone,
    ChatMessageModel) {
    'use strict';

    return Backbone.Collection.extend({
        model: ChatMessageModel
    });
});
