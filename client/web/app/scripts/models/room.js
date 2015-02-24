define(['backbone'], function(Backbone) {
    'use strict';

    return Backbone.Model.extend({
        defaults: {
            name: 'room name',
            id: 0
        }
    });
    // put stuff in here
});
