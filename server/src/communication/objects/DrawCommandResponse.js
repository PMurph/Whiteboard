var DrawCommandResponse = function(roomId, roomCommunicator, drawCommand) {
    this._roomCommunicator = roomCommunicator;
    this._drawCommand = drawCommand;
    this._usersToSendTo = [];
    this._numDrawCommandsSeen = 0;
    this._roomId = roomId;
}

DrawCommandResponse.prototype = {
    createResponseMessage: function() {
        return {drawOrderNum: this._numDrawCommandsSeen, roomId: this._roomId, drawCommand: this._drawCommand};
    },
    getDrawCommand: function() {
        return this._drawCommand;
    },
    getNumDrawCommandsSeen: function() {
        return this._numDrawCommandsSeen;
    },
    getRoomCommunicator: function() {
        return this._roomCommunicator;
    },
    getRoomId: function() {
        return this._roomId;
    },
    getUsersToSendTo: function() {
        return this._usersToSendTo;
    },
    setUsersToSendTo: function(usersToSendTo) {
        this._usersToSendTo = usersToSendTo;
    },
    setNumDrawCommandsSeen: function(numDrawCommandsSeen) {
        this._numDrawCommandsSeen = numDrawCommandsSeen;
    },
};

module.exports = DrawCommandResponse;

