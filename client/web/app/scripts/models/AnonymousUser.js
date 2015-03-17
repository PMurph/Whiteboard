define([
    'backbone',
    'models/User',
], function (Backbone, User) {
    'use strict';

    var AnonymousUser = User.extend({
        url: '/api/user',
        initialize: function () {
            this.set("anonymous", true);
        }
    });

    return AnonymousUser;
});
