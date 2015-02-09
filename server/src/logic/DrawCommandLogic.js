"use strict";
var DRAW_MESSAGE_TYPE = "drawCommand";

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
        var responseMessage = drawCommandResponse.createMessage();
        roomCommunicator.sendMessage(DRAW_MESSAGE_TYPE, responseMessage);
    }
};

module.exports = DrawCommandLogic;