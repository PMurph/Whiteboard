define([
    'jquery',
    'backbone',
    'marionette',

    'app',

    'routers/MainRouter',

    'views/master',
    'views/navbar',
    'layouts/createRoom',
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
    CreateRoomView,
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

            this._currentRoom = null;
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
                        image: (imageSrc) ? "<img src='/images/" + imageSrc + "'></img>" : ""
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
        renderCreateRoom: function() {
            this.mainContent.show(new CreateRoomView());
        },
        dashboard: function() {
            this.mainContent.show(new DashboardView());
        },
        room: function(id) {
            var self = this;

            if (!id) {
                if (this._currentRoom) {
                    id = this._currentRoom;
                }else{
                    throw "Invalid Room ID";
                }
            }
            var roomModel = new RoomModel({
                id: id
            });
            var roomLayout = new RoomLayoutView({
                model: roomModel
            });

            roomModel
                .fetch({data: {
                    id: id   
                }})
                .then(function() {
                    SocketController.joinRoom(id, roomLayout);
                    self._currentRoom = id;
                    self.mainContent.show(roomLayout);
                })
                .fail(function() {
                    SocketController.showErrorMessage("Failed to find room");
                });
        },
        inDashboard: function() {
            return (this.mainContent.currentView instanceof DashboardView);
        },
        inRoom: function() {
            return (this.mainContent.currentView instanceof RoomLayoutView);
        }
    });
});
