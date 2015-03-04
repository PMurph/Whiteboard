define([
    'backbone',
    'models/ChatMessage'
], function(
    Backbone,
    ChatMessageModel) {
    'use strict';

    return Backbone.Collection.extend({
        model: ChatMessageModel
    });
});
