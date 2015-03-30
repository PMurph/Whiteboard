
define([
    'marionette',
    'behaviors/roomInvites',
    'tpl!templates/roomInvites.html'
], function(
    Marionette,
    RoomInvitesBehavior,
    Template
) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,

        ui: {
            inviteUserBtn: "#inviteUserBtn",
            usernameTxt: "#inviteUsernameTxt",
            userList: "#roomUserList",
            removeUserBtn: "#removeInvitedUserBtn",
            removeAllUsersBtn: "#removeAllInvitedUsersBtn",
            statusText: "#roomInvitesStatusText"
        },

        setDisable: function(disable) {
            this.ui.inviteUserBtn.prop("disabled", disable);
            this.ui.usernameTxt.prop("disabled", disable);
            this.ui.userList.prop("disabled", disable);
            this.ui.removeUserBtn.prop("disabled", disable);
            this.ui.removeAllUsersBtn.prop("disabled", disable);
        },

        behaviors: {
            roomInvites: {
                behaviorClass: RoomInvitesBehavior
            }
        }
    });
});
