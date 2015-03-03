define([
    'underscore',
    'socket.io',
    'marionette',
    'vent',
], function(
    _,
    io,
    Marionette,
    vent) {
    'use strict';

    var Socket = Marionette.Object.extend({
        initialize: function() {
            this.listenTo(vent, 'leaveRoom', this._leaveRoom);
            this.listenTo(vent, 'chat', this._emitChat);
            this.listenTo(vent, 'draw', this._emitDraw);
            this.io = io();
        },

        _socketHash: {},

        joinRoom: function(roomID, roomView) {
            //var roomSocket =  io('/room/' + roomID);
            var roomSocket = this.io;
            this._socketHash[roomID] = roomSocket;

            roomSocket.on('chat', function(param) {
                if (roomID === param.roomID) {
                    roomView.chat.addMessage(param.message);
                }
            });

            roomSocket.on('draw', function(param) {
                if (roomID === param.roomID) {
                    roomView.whiteboard.drawFromMessage(param.message);
                }
            });
        },

        _leaveRoom: function(roomID) {
            // this._socketHash[roomID].off();
            // delete this._socketHash[roomID];
        },

        _emitChat: function(params) {
            this._socketHash[params.roomID].emit('chat', params);
        },

        _emitDraw: function(params) {
            this._socketHash[params.roomID].emit('draw', params);
        }
    });

    return new Socket();
});
