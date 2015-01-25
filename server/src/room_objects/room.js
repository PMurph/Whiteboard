var Room = function(creatingUser, whiteboard) {
    "use strict"
    this._creatingUser = creatingUser;
    this._connectedUsers = [creatingUser];
    this._whiteboard = whiteboard;
};

Room.prototype = {
    connectUserToRoom: function(connectingUser) {
        if(this._getUserIndex(connectingUser) == -1) {
            this._connectedUsers.push(connectingUser);
        }
    },

    disconnectUserFromRoom: function(disconnectingUser) {
        var userIndex = this._getUserIndex(disconnectingUser);
        this._removeUser(userIndex);
    },

    _getUserIndex: function(user) {
        var index = -1;
        for(var i = 0; i < this._connectedUsers.length && index == -1; i++) {
            if(this._areUsersEqual(user, this._connectedUsers[i])) {
                index = i;
            }
        }
        return index;
    },

    _areUsersEqual: function(user, other_user) {
        var usersAreEqual = false;
        if(user["id"] == other_user["id"]) {
            usersAreEqual = true;
        }
        return usersAreEqual;
    },

    _removeUser: function(index) {
        if(index >= 0) {
            this._connectedUsers.splice(index, 1);
        }
    },

    getCreatingUser: function() {
        return this._creatingUser;
    },

    getConnectedUsers: function() {
        return this._connectedUsers;
    },

    handleDrawCommand: function(drawCommandWrapper) {
        var drawCommand = drawCommandWrapper.getDrawCommand();

        this._whiteboard.addDrawCommand(drawCommand);
    }
};

module.exports.Room = Room;