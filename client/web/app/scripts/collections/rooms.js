define([
    'backbone',
    'models/room'
], function(
    Backbone,
    RoomModel) {
    'use strict';

    return Backbone.Collection.extend({
        model: RoomModel
    });
});
