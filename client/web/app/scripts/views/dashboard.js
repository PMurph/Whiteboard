
define([
    'jquery',
    'underscore',
    'marionette',
    './../app'
], function(
    $,
    _,
    Marionette,
    App) {
    'use strict';

    return Marionette.LayoutView.extend({
        initialize: function () {
            var t = _.template("<div id='dashboard'><% if (authenticated === false) { %> Unauthenticated <% } else{ %> Authenticated <% } %></div>");

            this.authenticated = false;

            if (App) {
                this.authenticated = App.userSessionController.isAuthenticated();

            }
            this.template = t({authenticated: this.authenticated || false});
        },

        regions: {
            dashboard: '#dashboard'
        }
    });
});
