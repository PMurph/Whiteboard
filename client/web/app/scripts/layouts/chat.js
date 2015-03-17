define([
    'marionette',
    'collections/chatMessages',
    'views/chat/chatMessages',
    'vent',
    'tpl!/scripts/templates/chat/layout.html'
], function(
    Marionette,
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

        addMessage: function(msg) {
            this.chatCollection.add(msg);
        },

        _sendMessage: function() {
            var message = {
                name: 'a name',
                message: this.ui.chatInput.val()
            };

            this.chatCollection.add(message);
            vent.trigger('chat', {
                roomID: this.roomModel.get('id'),
                message: message
            });

            this.ui.chatMessages.scrollTop(this.ui.chatMessages[0].scrollHeight);

            this.ui.chatInput.val('');
        }
    });
});
