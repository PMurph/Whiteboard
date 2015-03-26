
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
            this._roomSettingsView = null;
            this._roomInvitesView = null;
        },
        
        regions: {
            roomSettings: "#newRoomOptions",
            roomInvites: "#newRoomInvites"
        },

        onShow: function() {
            this._roomSettingsView = new RoomSettingsView({model: this._newRoom, layout: this});
            this._roomInvitesView = new RoomInvitesView({model: this._newRoom, layout: this});

            this.roomSettings.show(this._roomSettingsView);
            this.roomInvites.show(this._roomInvitesView);
            this._roomInvitesView.setDisable(true);
        }
    });
});
