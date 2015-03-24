define([
    'marionette',
    'layouts/chat',
    'views/room/whiteboard',
    'layouts/drawTools',
    'vent',
    'tpl!/scripts/templates/room/layout.html'
], function(
    Marionette,
    ChatViewComponent,
    WhiteboardView,
    DrawToolsView,
    vent,
    Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        className: 'content-container',

        regions: {
            whiteboardRegion: '#whiteboard-region',
            chatRegion: '#chat-region',
            toolsRegion: '#tools-region',
        },

        onShow: function() {
            this.drawTool = new DrawToolsView();
            this.whiteboard = new WhiteboardView({
                roomModel: this.model,
                drawTool: this.drawTool
            });
            this.chat = new ChatViewComponent({
                roomModel: this.model
            });

            this.chatRegion.show(this.chat);
            this.whiteboardRegion.show(this.whiteboard);
            this.toolsRegion.show(this.drawTool);
        },

        onBeforeDestroy: function() {
            vent.trigger('leaveRoom');
        }
    });
});
