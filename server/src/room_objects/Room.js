"use strict";

var Room = function(roomId, creatingUser, whiteboard, messageFactory) {
    this._creatingUser = creatingUser;
    this._connectedUsers = [creatingUser];
    this._id = roomId;
    this._whiteboard = whiteboard;
    this._messageFactory = messageFactory;
};

Room.prototype = {
    connectUserToRoom: function(connectingUser) {
        if(this._getUserIndex(connectingUser) === -1) {
            this._connectedUsers.push(connectingUser);
        }
    },

    disconnectUserFromRoom: function(disconnectingUser) {
        var userIndex = this._getUserIndex(disconnectingUser);
        this._removeUser(userIndex);
    },

    _getUserIndex: function(user) {
        var index = -1;
        for(var i = 0; i < this._connectedUsers.length && index === -1; i++) {
            if(user.userId === this._connectedUsers[i].userId) {
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

    handleDrawCommand: function(drawCommandMessage, drawCommandLogic) {
        var drawCommand = drawCommandMessage.getDrawCommand();
        this._whiteboard.addDrawCommand(drawCommand);

        var drawOrder = this._whiteboard.getNumDrawCommandsSeen();
        drawCommandMessage.setDrawOrder(drawOrder);

        drawCommandLogic.handleDrawResponse(drawCommandMessage);
    },

    handleGetAllDrawCommands: function(getAllDrawCommandsMessage, drawCommandLogic) {
        var drawCommands = this._whiteboard.getAllDrawCommands();
        getAllDrawCommandsMessage.setDrawCommands(drawCommands);
        drawCommandLogic.handleGetAllDrawCommandsResponse(getAllDrawCommandsMessage);
    },
};

module.exports = Room;