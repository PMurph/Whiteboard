require([
    'jquery',
    'backbone',
    'app',
    'marionette',
    'controllers/MainController',
    'controllers/UserSession'
], function ($,
    Backbone,
    App,
    Marionette,
    MainController,
    UserSessionController) {
             
    'use strict';

    App.addRegions({
        'body': 'body'
    });

    App.on('start', function() {
        this.mainController = new MainController();
        this.mainView = this.mainController.view;

        this.userSessionController = new UserSessionController();

        this.body.show(this.mainView);
    });

    App.on('start', function() {
        this.userSessionController.findSavedSession();
        if (!this.userSessionController.isAuthenticated()) {
            this.userSessionController.authAnonymous();
        }
    });

    App.on('start', function() {
        Backbone.history.start({ pushState: false, root: '/' });
    });

    App.start();
});
