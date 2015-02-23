define([
    'jquery',
    'backbone',
    'marionette',
    
    'app',

    'routers/MainRouter',

    'views/master',
    'views/navbar',
    'layouts/dashboard',
    'layouts/room',

    'models/room'
], function(
    $,
    Backbone,
    Marionette,

    App,

    Router,

    MasterView,
    NavbarView,
    DashboardView,
    RoomLayoutView,

    RoomModel
) {
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
        showShield: function() {
            this.view.centerBox.empty();
            this.view.ui.appShield.show();
        },
        hideShield: function() {
            this.view.centerBox.empty();
            this.view.ui.appShield.hide();
        },
        renderHeader: function(authUser) {
            var user = authUser;

            if (!user) {
                if (App.userSessionController) {
                    model = App.userSessionController.getUser() 
                }
            }
            this.navbarView = new NavbarView({
                model: user
            });
            this.header.show(this.navbarView);
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
