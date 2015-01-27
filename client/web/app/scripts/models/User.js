define([
        'backbone'
], function (Backbone) {
    'use strict';

    var User = Backbone.Model.extend({
        url: '/api/user',
        initialize: function () {
            this.set("anonymous", false);
        }
    });

    return User;
});
