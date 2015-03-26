
define([
    'marionette',
    'models/User'
], function (
     Marionette,
     User
) {
    'use strict';

    var RoomInvitesBehavior = Marionette.Behavior.extend({
        events: {
            "click @ui.inviteUserBtn": "inviteUser",
            "click @ui.removeUserBtn": "removeSelectedUser",
            "click @ui.removeAllUsersBtn": "removeAllUsers"
        },
        _setStatus: function(text) {
            var statusLabel = this.view.ui.statusText;
            statusLabel.html(text);
            statusLabel.addClass("error");
        },
        _clearUsernameSearch: function() {
            this.view.ui.usernameTxt.val('');
        },
        removeSelectedUser: function() {
            var room = this.view.model;
            var userList = this.view.ui.userList;

            var selectedUsers = userList.find(":selected");

            for(var i = 0; i < selectedUsers.length; i++) {
                var userOption = selectedUsers[i];
                var userId = userOption.value;

                room.removeUserInvite(userId);
            }

            selectedUsers.remove();

        },
        removeAllUsers: function() {
            var room = this.view.model;
            var userList = this.view.ui.userList;

            userList.empty();

            room.removeAllInvites();
        },
        inviteUser: function() {
            var self = this;

            var room = this.view.model;

            this._setStatus("");

            var username = this.view.ui.usernameTxt.val();
            var userModel = new User();

            userModel.fetch({ data: {login: username}})
                .then(function(user) {
                    var userList = self.view.ui.userList;
                    var userId = user._id;
                    try {
                        room.addUserInvite(userId);
                    }catch(e){
                        self._setStatus("Error: " + e);
                        return;
                    }
                    userList.append("<option value=" + userId + ">" + user.displayName + " (" + user.login +  ")</option>");
                    self.view.ui.usernameTxt.val("");
                })
                .fail(function() {
                    self._setStatus("Error: Failed to find user");
                });

        }
    });

    return RoomInvitesBehavior;
});
