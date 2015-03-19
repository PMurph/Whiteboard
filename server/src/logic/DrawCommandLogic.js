"use strict";
var Events = require("../Events.js");

var DrawCommandLogic = function(roomManager) {
    this._roomManager = roomManager;
};

DrawCommandLogic.prototype = {
    handleDrawCommand: function(drawCommandMessage) {
        var room = this._roomManager.getRoom(drawCommandMessage.getRoomId());
        room.handleDrawCommand(drawCommandMessage, this);
    },
    handleDrawResponse: function(drawCommandResponse) {
        var roomCommunicator = drawCommandResponse.getRoomCommunicator();
        var responseMessage = drawCommandResponse.createMessage();
        roomCommunicator.sendMessage(Events.DrawCommand, responseMessage);
    },
    handleGetAllDrawCommands: function(getAllDrawCommandsMessage) {
        var room = this._roomManager.getRoom(getAllDrawCommandsMessage.getRoomId());
        if (room) {
            room.handleGetAllDrawCommands(getAllDrawCommandsMessage, this);
        } else {
            throw "Invalid Room ID in Draw Message";
        }
    },
    handleGetAllDrawCommandsResponse: function(getAllDrawCommandsResponse) {
        var roomCommunicator = getAllDrawCommandsResponse.getRoomCommunicator();
        var responseMessage = getAllDrawCommandsResponse.createMessage();
        roomCommunicator.sendMessageToSocket(Events.GetAllDrawCommands, responseMessage);
    },
};

module.exports = DrawCommandLogic;
