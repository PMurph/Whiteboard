define([
    'marionette',
    'views/login/layout'
], function(
    Marionette,
    LoginView) {
    'use strict';

    return Marionette.Controller.extend({
        login: function() {
            this.mainContent.show(new LoginView());
        }
    });
});
