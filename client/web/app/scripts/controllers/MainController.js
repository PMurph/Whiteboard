define([
    'marionette',
    'views/dashboard',
    'views/login/layout'
], function(
    Marionette,
    Dashboard,
    LoginView) {
    'use strict';

    return Marionette.Controller.extend({
        login: function() {
            this.mainContent.show(new LoginView());
        },
        dashboard: function() {
            this.mainContent.show(new Dashboard());
        }
    });
});
