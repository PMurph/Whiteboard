define([
    'app',
    'underscore',
    'socket.io',
    'marionette',
    'vent',
], function(
    App,
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

        showErrorMessage: function(message) {
            App.mainController.showShield();
            App.mainController.setStatusBox(message + "<br /><a href='#' id='continueDashboardLink'>Continue to dashboard</a>");
            var continueLink = document.getElementById("continueDashboardLink");
            continueLink.onclick = function() {
                App.mainController.hideShield();
            };
        },

        joinRoom: function(roomID, roomView) {
            var self = this;

            if(!this.isConnected()) {
                throw "Error: Not connected to Socket.";
            }
            if(!App.userSessionController.isAuthenticated()) {
                throw "Error: Not authenticated.";
            }


            this.io.once('joinRequest', function(response, status) {
                if (response === "rejected") {
                    console.error("rejected: " + status);
                    self.showErrorMessage("Failed to join room");
                }else if (response !== roomID){
                    self.showErrorMessage("Failed to join room (Server return incorrect id)");
                }else{
                    self._roomID = roomID;
                    self._roomView = roomView;
                    self.io.once('getAllDrawCommands', function(drawMsgs) {
                        self._roomView.whiteboard.drawFromGetAllMessages(drawMsgs.drawCommands);
                    });
                    self.io.once('getAllChat', function(chatMsgs) {
                        self._roomView.chat.chatFromGetAllMessages(chatMsgs.chatMessages);
                    });
                    self.io.emit('getAllDrawCommands');
                    self.io.emit('getAllChat');
                }
            });

            this.io.emit('joinRequest', {
                roomId: roomID,
                authToken: this.userSession.getUser().get('authToken')
            });
        },

        isConnected: function() {
            return this._connected;
        },

        _leaveRoom: function() {
            if(this._roomID) {
                this.io.emit('leaveRoom', {
                    roomId: this._roomID,
                });
                this._roomID = undefined;
                this._roomView = undefined;
            }
        },

        _emitChat: function(msg) {
            var message = {
                name: this.userSession.getUser().get('displayName'),
                message: msg
            };

            this.io.emit('chatMessage', message);
        },

        _emitDraw: function(params) {
            this.io.emit('drawCommand', params);
        },

        // We don't have to unsubscribe from these when we leave
        _setupSocketListeners: function() {
            var self = this;
            this.io.on('chatMessage', function(param) {
                self._roomView.chat.addMessage(param.chatMessage);
            });

            this.io.on('drawCommand', function(param) {
                self._roomView.whiteboard.drawFromMessage(param.drawCommand);
            });

            this.io.on('roomMessage', function(param) {
                self._roomView.chat.addMessage(param);
            });
        },

        _setupSocketEvents: function() {
            var self = this;

            this.io.on('connect', function() {
                self._connected = true;
            });
            this.io.on('disconnect', function() {
                self.showErrorMessage("Socket was disconnected");
                self._connected = false;
            });
            this.io.on('error', function(err) {
                self.showErrorMessage("Socket encountered an error");
                console.error("SocketIO error: " + err);
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
                if (this._roomID !== undefined) {
                    self._leaveRoom();
                }
                self.io.close();
                self.io.disconnect();
            });
        }
    });

    return new Socket();
});
