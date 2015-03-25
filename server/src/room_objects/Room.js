"use strict";

var Room = function(dbDocument, whiteboard, chat) {
    this._doc = dbDocument;
    this._whiteboard = whiteboard;
    this._chat = chat;
};

Room.prototype = {
    connectUserToRoom: function(connectingUser, cb) {
        this._doc.connectedUsers.push(connectingUser.id);
        this._doc.save(cb);
    },

    disconnectUserFromRoom: function(disconnectingUser, cb) {
        var userDoc = this._doc.connectedUsers.id(disconnectingUser.id);
        if(userDoc) {
            userDoc.remove();

            this._doc.save(cb);
        }else{
            console.error("User not in room");
            cb("No user found", null);
        }
    },

    getCreatingUser: function() {
        return this._creatingUser;
    },

    getConnectedUsers: function() {
        return this._connectedUsers;
    },

    getId: function(){
        return this._doc.id;
    },

    handleDrawCommand: function(drawCommandMessage, drawCommandLogic) {
        var self = this;

        var drawCommand = drawCommandMessage.getDrawCommand();
        var dbCB = function(error, roomDoc) {
            if(error || !roomDoc) {
                console.error("DB Error: " + error);
            }else{
                var drawOrder = self._whiteboard.getNumDrawCommandsSeen();
                drawCommandMessage.setDrawOrder(drawOrder);

                drawCommandLogic.handleDrawResponse(drawCommandMessage);

            }
        };
        this._whiteboard.addDrawCommand(drawCommand, dbCB);

    },

    handleGetAllDrawCommands: function(getAllDrawCommandsMessage, drawCommandLogic) {
        var drawCommands = this._whiteboard.getAllDrawCommands();
        getAllDrawCommandsMessage.setDrawCommands(drawCommands);
        drawCommandLogic.handleGetAllDrawCommandsResponse(getAllDrawCommandsMessage);
    },

    handleChatMessage: function(chatMessage, chatLogic) {
        var self = this;

        var chat = chatMessage.getChatMessage();
        var dbCB = function (error, roomDoc) {
            if(error || !roomDoc) {
                console.error("DB Error: " + error);
            }else{
                var chatOrder = self._chat.getNumChatSeen();
                chatMessage.setChatOrder(chatOrder);

                chatLogic.handleChatResponse(chatMessage);
            }
        };
        this._chat.addChat(chat, dbCB);
    },

    handleGetAllChatMessages: function(getAllChatMessage, chatLogic) {
        var chatMessages = this._chat.getAllChat();
        getAllChatMessage.setChatMessages(chatMessages);
        chatLogic.handleGetAllChatMessagesResponse(getAllChatMessage);
    }
};

module.exports = Room;
