var DrawCommandResponse = function(roomCommunicator, drawCommand) {
    this._roomCommunicator = roomCommunicator;
    this._drawCommand = drawCommand;
    this._usersToSendTo = [];
    this._numDrawCommandsSeen = 0;
}

DrawCommandResponse.prototype = {
    getDrawCommand: function() {
        return this._drawCommand;
    },
    getNumDrawCommandsSeen: function() {
        return this._numDrawCommandsSeen;
    },
    getRoomCommunicator: function() {
        return this._roomCommunicator;
    },
    getUsersToSendTo: function() {
        return this._usersToSendTo;
    },
    setUsersToSendTo: function(usersToSendTo) {
        this._usersToSendTo = usersToSendTo;
    },
    setNumDrawCommandsSeen: function(numDrawCommandsSeen) {
        this._numDrawCommandsSeen = numDrawCommandsSeen;
    }
};

module.exports = DrawCommandResponse;

