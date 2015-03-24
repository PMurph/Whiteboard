
define([
    'app',
    'marionette',
    'models/room',
    'views/room/settings',
    'views/room/invites',
    'tpl!templates/createRoom.html'
], function(
    App,
    Marionette,
    Room,
    RoomSettingsView,
    RoomInvitesView,
    Template
) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,
        className: 'content-container',

        initialize: function() {
            this._newRoom = new Room();
        },
        
        regions: {
            roomSettings: "#newRoomOptions",
            roomInvites: "#newRoomInvites"
        },

        onShow: function() {
            this.roomSettings.show(new RoomSettingsView({model: this._newRoom}));
            this.roomInvites.show(new RoomInvitesView({model: this._newRoom}));
        }
    });
});
