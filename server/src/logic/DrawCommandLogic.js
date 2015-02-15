"use strict";
var DRAW_MESSAGE_TYPE = "drawCommand";
var GET_ALL_DRAW_MESSAGE_TYPE = "getAllDrawCommands";

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
    },
    handleGetAllDrawCommands: function(getAllDrawCommandsMessage) {
        var room = this._roomManager.getRoom(getAllDrawCommandsMessage.getRoomId());
        room.handleGetAllDrawCommands(getAllDrawCommandsMessage, this);
    },
    handleGetAllDrawCommandsResponse: function(getAllDrawCommandsResponse) {
        var roomCommunicator = getAllDrawCommandsResponse.getRoomCommunicator();
        var responseMessage = getAllDrawCommandsResponse.createMessage();
        var socket = getAllDrawCommandsResponse.getSocket();
        roomCommunicator.sendMessageToSocket(GET_ALL_DRAW_MESSAGE_TYPE, responseMessage, socket);
    },
};

module.exports = DrawCommandLogic;