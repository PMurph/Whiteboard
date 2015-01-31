var DrawCommandResponse = function(roomCommunicator, drawCommand) {
    this._roomCommunicator = roomCommunicator;
    this._drawCommand = drawCommand;
    this._usersToSendTo = [];
}

DrawCommandResponse.prototype = {
    getDrawCommand: function() {
        return this._drawCommand;
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
};

module.exports = DrawCommandResponse;

