define(["marionette"], function (Marionette) {
    'use strict';

    var UserSessionController = Marionette.Controller.extend({
        initialize: function() {
            this._userSession = null;
            this._currentUser = null;
        },
        isAuthenticated: function() {
            return (this._userSession !== null);
        }

    });

    return UserSessionController;
});
