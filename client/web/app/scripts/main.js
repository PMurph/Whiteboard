require([
    'jquery',
    'backbone',
    'app',
    'marionette',
    'controllers/MainController',
    'controllers/UserSession',
    'routers/MainRouter',
    'views/master'
], function ($,
    Backbone,
    App,
    Marionette,
    MainController,
    UserSessionController,
    Router,
    MasterView) {
             
    'use strict';

    App.addRegions({
        'body': 'body'
    });

    App.on('start', function() {
        this.mainController = new MainController();
        this.router = new Router({
            controller: this.mainController
        });
        this.mainView = new MasterView({
            controller: this.mainController
        });

        this.userSessionController = new UserSessionController();
        this.userSessionController.authAnonymous();

        this.body.show(this.mainView);
        this.mainController.mainContent = this.mainView.mainContent;

    });

    App.on('start', function() {
        Backbone.history.start({ pushState: false, root: '/' });
    });

    App.start();
});
