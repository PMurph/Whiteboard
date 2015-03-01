define([
    'marionette',
    'layouts/chat',
    'views/room/whiteboard',
    'controllers/SocketController',
    'vent',
    'tpl!/scripts/templates/room/layout.html'
], function(
    Marionette,
    ChatViewComponent,
    WhiteboardView,
    SocketController,
    vent,
    Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        className: 'content-container',

        regions: {
            whiteboardRegion: '#whiteboard-region',
            chatRegion: '#chat-region',
            toolsRegion: '#tools-region'
        },

        onShow: function() {
            this.whiteboard = new WhiteboardView({
                roomModel: this.model
            });
            this.chat = new ChatViewComponent({
                roomModel: this.model
            });

            this.chatRegion.show(this.chat);
            this.whiteboardRegion.show(this.whiteboard);
        },

        onBeforeDestroy: function() {
            vent.trigger('leaveRoom', this.model.get('id'));
        }

    });
});
