define([
    'jquery',
    'backbone',
    'marionette',
    'layouts/dashboard',
    'layouts/room',
    'layouts/login',
    'models/room'
], function(
    $,
    Backbone,
    Marionette,
    DashboardView,
    RoomLayoutView,
    LoginView,
    RoomModel) {
    'use strict';

    return Marionette.Controller.extend({
        _setupAjax: function() {
            $.ajaxSetup({
                cache: false,
                crossDomain: true,
                dataType: 'jsonp',
                contentType: 'application/json',
                statusCode: {
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
            this.mainContent.show(new DashboardView());
        },

        room: function(id) {
            var roomModel = new RoomModel({
                id: id,
                name: 'stub name ' + id
            });

            this.mainContent.show(new RoomLayoutView({
                model: roomModel
            }));
        }
    });
});
