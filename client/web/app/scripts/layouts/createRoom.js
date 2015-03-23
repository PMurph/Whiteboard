
define([
    'app',
    'marionette',
    'views/room/settings',
    'views/room/invites',
    'tpl!templates/createRoom.html'
], function(
    App,
    Marionette,
    RoomSettingsView,
    RoomInvitesView,
    Template
) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,
        className: 'content-container',
        
        regions: {
            roomSettings: "#newRoomOptions",
            roomInvites: "#newRoomInvites"
        },

        onShow: function() {
            this.roomSettings.show(new RoomSettingsView());
            this.roomInvites.show(new RoomInvitesView());
        }
    });
});
