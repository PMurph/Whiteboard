define([
    'marionette',
    'views/chat/chatMessage'
], function(
    Marionette,
    ChatMessageItemView
) {
    'use strict';

    return Marionette.CollectionView.extend({
        childView: ChatMessageItemView
    });
});
