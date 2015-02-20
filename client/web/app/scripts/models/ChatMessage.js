define(['backbone'], function(Backbone) {
    'use strict';

    return Backbone.Model.extend({
        defaults: {
            name: 'default name',
            message: 'default message'
        }
    });
});
