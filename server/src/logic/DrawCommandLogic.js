"use strict";
var DrawCommandLogic = function(roomManager) {
    this._roomManager = roomManager;
};

DrawCommandLogic.prototype = {
    handleDrawCommand: function(drawCommandMessage) {
        var room = this._roomManager.getRoom(drawCommandMessage.getRoomId());
        room.handleDrawCommand(drawCommandMessage);
    },
    handleDrawResponse: function(drawCommandResponse) {
        var roomCommunicator = drawCommandResponse.getRoomCommunicator();
        var responseMessage = drawCommandResponse.createResponseMessage();
        roomCommunicator.sendMessage(responseMessage);
    }
};

module.exports = DrawCommandLogic;