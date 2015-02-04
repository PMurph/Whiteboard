define([
    'marionette',
    'layouts/chat',
    'views/room/whiteboard',
    'tpl!/scripts/templates/room/layout.html'
], function(
    Marionette,
    ChatViewComponent,
    WhiteboardView,
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
            this.chatRegion.show(new ChatViewComponent());
            this.whiteboardRegion.show(new WhiteboardView());
        }
    });
});
