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
    'models/room',
    'controllers/SocketController',
    'tpl!templates/status.html'
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
    RoomModel,
    SocketController,
    StatusTemplate) {
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
        setStatusBox: function(message, imageSrc) {
            this.view.centerBox.show(new Marionette.ItemView({
                template: StatusTemplate,
                templateHelpers: function() {
                    return {
                        message: message,
                        image: "<img src='/images/" + imageSrc + "'></img>"
                    };
                }
            }));

        },
        renderHeader: function(authUser) {
            var user = authUser;

            if (!user && App.userSessionController) {
                user = App.userSessionController.getUser();
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
            var roomLayout = new RoomLayoutView({
                model: roomModel
            });

            SocketController.joinRoom(id, roomLayout);
            this.mainContent.show(roomLayout);
        }
    });
});
