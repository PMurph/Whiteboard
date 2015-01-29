define([
    'jquery',
    'backbone',
    'marionette',
    'views/dashboard',
    'views/login/layout'
], function(
    $,
    Backbone,
    Marionette,
    Dashboard,
    LoginView) {
    'use strict';

    return Marionette.Controller.extend({
        _setupAjax: function() {
            $.ajaxSetup({
                cache: false,
                crossDomain: true,
                dataType: 'jsonp',
                contentType: 'application/json',
                statusCode: {
                    // Forbidden
                    403: function() {
                        Backbone.history.navigate('login', {trigger: true});
                        //self.login();
                    }
                }
            });
        },
        initialize: function() {
            this._setupAjax();
        },
        login: function() {
            this.mainContent.show(new LoginView());
        },
        dashboard: function() {
            this.mainContent.show(new Dashboard());
        }
    });
});
