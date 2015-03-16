"use strict";
var Events = {

    SocketCreated: "connection",
    SocketDestroyed: "disconnect",

    DrawCommand: "drawCommand",
    GetAllDrawCommands: "getAllDrawCommands",

    ChatMessage: "chatMessage",
    GetAllChat: "getAllChat",

    JoinRequest: "joinRequest",
    LeaveRoom: "leaveRoom",
    UserJoined: "userJoined",
    UserLeft: "userLeft"

};

module.exports = Events;
