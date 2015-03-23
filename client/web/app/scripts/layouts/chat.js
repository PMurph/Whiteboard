define([
    'marionette',
    'underscore',
    'collections/chatMessages',
    'views/chat/chatMessages',
    'vent',
    'tpl!/scripts/templates/chat/layout.html'
], function(
    Marionette,
    _,
    ChatMessagesCollection,
    ChatMessagesView,
    vent,
    Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        className: 'chat-component',

        ui: {
            chatInput: '#chat-input',
            sendBtn: '#send-btn',
            chatMessages: '#chat-messages-region'
        },

        regions: {
            chatMessagesRegion: '#chat-messages-region',
        },

        events: {
            'click #send-btn': '_sendMessage'
        },

        initialize: function(options) {
            this.roomModel = options.roomModel;
            this.chatCollection = new ChatMessagesCollection();
        },

        onShow: function() {
            this.chatMessagesRegion.show(new ChatMessagesView({
                collection: this.chatCollection
            }));

            this.bindUIElements();
        },

        addMessage: function(msg) {
            this.chatCollection.add(msg);
            this.ui.chatMessages.scrollTop(this.ui.chatMessages[0].scrollHeight);
        },

        chatFromGetAllMessages: function(msgs) {
            this.chatCollection.add(msgs);
            this.ui.chatMessages.scrollTop(this.ui.chatMessages[0].scrollHeight);
        },

        _sendMessage: function() {
            vent.trigger('chat', this.ui.chatInput.val());
            this.ui.chatInput.val('');
        }
    });
});
