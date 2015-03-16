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
            this.io = io();
            this._connected = false;
            this._roomID = undefined;
            this._roomView = undefined;

            this._setupSocketListeners();
            this._setupSocketEvents();
            this._setupViewListeners();

            this._setupWindowEvents();
        },

        joinRoom: function(roomID, roomView) {
            var self = this;

            this._roomID = roomID;
            this._roomView = roomView;

            this.io.once('joined', function() {
                self.io.once('getAllDrawCommands', function(drawMsgs) {
                    self._roomView.whiteboard.drawFromGetAllMessages(drawMsgs.drawCommands);
                });
                self.io.emit('getAllDrawCommands');
            });

            this.io.emit('joinRequest', {
                roomId: this._roomID,
                authToken: this._authToken
            });
        },

        isConnected: function() {
            return this._connected;
        },

        _leaveRoom: function(roomID) {
            this.io.emit('leaveRoom', roomID);
        },

        _emitChat: function(params) {
            this.io.emit('chat', params);
        },

        _emitDraw: function(params) {
            this.io.emit('drawCommand', params);
        },

        // We don't have to unsubscribe from these when we leave
        _setupSocketListeners: function() {
            var self = this;
            this.io.on('chat', function(param) {
                self._roomView.chat.addMessage(param.message);
            });

            this.io.on('drawCommand', function(param) {
                self._roomView.whiteboard.drawFromMessage(param.drawCommand.message);
            });

            this.io.on('roomChatMessage', function() {
                
            });
        },

        _setupSocketEvents: function() {
            this.io.on('connect', function() {
                this._connected = true;
            });
            this.io.on('disconnect', function() {
                this._connected = false;
            });
            this.io.on('error', function(err) {
                console.error("SokcetIO error: " + err);
            });
        },

        _setupViewListeners: function() {
            this.listenTo(vent, 'leaveRoom', this._leaveRoom);
            this.listenTo(vent, 'chat', this._emitChat);
            this.listenTo(vent, 'draw', this._emitDraw);
        },

        _setupWindowEvents: function() {
            var self = this;
            window.addEventListener("beforeunload", function () {
                self.io.close();  
                self.io.disconnect();  
            });
        }
    });

    return new Socket();
});
