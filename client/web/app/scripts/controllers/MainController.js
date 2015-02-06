define([
    'jquery',
    'backbone',
    'marionette',
    'routers/MainRouter',
    'views/master',
    'views/navbar',
    'layouts/dashboard',
    'layouts/room',
    'layouts/login',
    'models/room'
], function(
    $,
    Backbone,
    Marionette,
    Router,
    MasterView,
    NavbarView,
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
        _setupRouter: function() {
            this.router = new Router({
                controller: this
            });
        },
        _setupView: function() {
            this.view = new MasterView({
                controller: this
            });
            this.view.render();
            this.mainContent = this.view.mainContent;
            this.header = this.view.header;
        },
        initialize: function() {
            this._setupRouter();
            this._setupView();

            this._setupAjax();
        },
        showSheild: function() {
            this.view.ui.appShield.show();
        },
        hideSheild: function() {
            this.view.ui.appShield.hide();
        },
        renderHeader: function() {
            this.header.show(new NavbarView());
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
