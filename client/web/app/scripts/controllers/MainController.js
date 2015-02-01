define([
    'marionette',
    'layouts/dashboard',
    'layouts/room',
    'models/room'
], function(
    Marionette,
    DashboardView,
    RoomLayoutView,
    RoomModel) {
    'use strict';

    return Marionette.Controller.extend({
        dashboard: function() {
            this.mainContent.show(new DashboardView());
        },

        room: function(id) {
            var roomModel = new RoomModel({
                id: id,
                name: 'stub name ' + id
            });

            this.mainContent.show(new RoomLayoutView({
                model: roomModel
            }));
        }
    });
});
