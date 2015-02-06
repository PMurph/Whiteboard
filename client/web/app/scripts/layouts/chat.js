define([
    'marionette',
    'collections/chatMessages',
    'views/chat/chatMessages',
    'tpl!templates/chat/layout.html'
], function(
    Marionette,
    ChatMessagesCollection,
    ChatMessagesView,
    Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        className: 'chat-component',

        ui: {
            chatInput: '#chat-input',
            sendBtn: '#send-btn'
        },

        regions: {
            chatMessagesRegion: '#chat-messages-region',
        },

        events: {
            'click #send-btn': '_sendMessage'
        },

        initialize: function() {
            // Stub chat messages
            this.chatCollection = new ChatMessagesCollection();
            for (var i = 0; i < 10; i++) {
                this.chatCollection.add({
                    name: 'cool guy ' + i,
                    message: 'message yo ' + i
                });
            }
        },

        onShow: function() {
            this.chatMessagesRegion.show(new ChatMessagesView({
                collection: this.chatCollection
            }));

            this.bindUIElements();
        },

        _sendMessage: function() {
            this.chatCollection.add({
                name: 'a name',
                message: this.ui.chatInput.val()
            });

            this.ui.chatInput.val('');
        }
    });
});
