define([
    'marionette',
    'layouts/chat',
    'views/room/whiteboard',
    'controllers/SocketController',
    'tpl!/scripts/templates/room/layout.html'
], function(
    Marionette,
    ChatViewComponent,
    WhiteboardView,
    SocketController,
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

        initialize: function() {
            this.socket = new SocketController();
        },

        onShow: function() {
            this.chatRegion.show(new ChatViewComponent());
            this.whiteboardRegion.show(new WhiteboardView());
        }
    });
});
