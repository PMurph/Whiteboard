"use strict";
var Events = require("../Events.js");

var DrawCommandLogic = function(roomManager) {
    this._roomManager = roomManager;
};

DrawCommandLogic.prototype = {
    handleDrawCommand: function(drawCommandMessage) {
        var self = this;

        var dbCB = function (error, room) {
            if (error || !room) {
                console.error("No room found");
            }else{
                room.handleDrawCommand(drawCommandMessage, self);
            }
        };
        drawCommandMessage.getRoom(dbCB);
    },
    handleDrawResponse: function(drawCommandResponse) {
        var roomCommunicator = drawCommandResponse.getRoomCommunicator();
        var responseMessage = drawCommandResponse.createMessage();
        roomCommunicator.sendMessage(Events.DrawCommand, responseMessage);
    },
    handleGetAllDrawCommands: function(getAllDrawCommandsMessage) {
        var self = this;

        var dbCB = function (error, room) {
            if (error || !room) {
                console.error("No room found");
            }else{
                room.handleGetAllDrawCommands(getAllDrawCommandsMessage, self);
            }
        };
        getAllDrawCommandsMessage.getRoom(dbCB);
    },
    handleGetAllDrawCommandsResponse: function(getAllDrawCommandsResponse) {
        var roomCommunicator = getAllDrawCommandsResponse.getRoomCommunicator();
        var responseMessage = getAllDrawCommandsResponse.createMessage();
        roomCommunicator.sendMessageToSocket(Events.GetAllDrawCommands, responseMessage);
    },
};

module.exports = DrawCommandLogic;
