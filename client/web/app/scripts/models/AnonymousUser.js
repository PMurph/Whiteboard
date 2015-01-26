define([
        'backbone',
        'models/User',
], function (Backbone, User) {
    'use strict';

    var AnonymousUser = User.extend({
        url: '/api/anonymousUser',
        initialize: function () {
            this.anonymous = true;
        }
    });

    return AnonymousUser;
});
