var Room = function(roomId, creatingUser, whiteboard) {
    "use strict"
    this._creatingUser = creatingUser;
    this._connectedUsers = [creatingUser];
    this._id = roomId;
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
            if(user["id"] == this._connectedUsers[i]["id"]) {
                index = i;
            }
        }
        return index;
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

    getId: function(){
        return this._id;
    },

    handleDrawCommand: function(drawCommandWrapper) {
        var drawCommand = drawCommandWrapper.getDrawCommand();

        this._whiteboard.addDrawCommand(drawCommand);
        drawCommandWrapper.setUsersToPushTo(this._connectedUsers);

        var numDrawCommandsSeen = this._whiteboard.getNumDrawCommandsSeen();
        drawCommandWrapper.setNumDrawCommandsSeen(numDrawCommandsSeen);
    }
};

module.exports.Room = Room;