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
            this.view = new MasterView();
            this.view.render();
            this.mainContent = this.view.getRegion("mainContent");
            this.header = this.view.getRegion("header");
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
            this.navbarView = new NavbarView();
            this.header.show(this.navbarView);
        },
        login: function() {
            this.loginView = new LoginView();
            this.mainContent.show(this.loginView);
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
