define([
    'backbone',
    'models/room'
], function(
    Backbone,
    RoomModel) {
    'use strict';

    return Backbone.Collection.extend({
        url: 'api/room',
    
        model: RoomModel
    });
});
