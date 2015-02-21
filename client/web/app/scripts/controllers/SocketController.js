define([
    'socket.io',
    'marionette',
], function(
    SocketIO,
    Marionette) {
    'use strict';

    return Marionette.Object.extend({
        initialize: function() {
            this.socket = new SocketIO();
        }
    });
});
