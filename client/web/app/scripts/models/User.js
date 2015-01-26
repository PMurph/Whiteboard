define([
        'backbone'
], function (Backbone) {
    'use strict';

    var User = Backbone.Model.extend({
        url: '/api/user',
        initialize: function () {
            this.anonymous = false;
        }
    });

    return User;
});
