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
        this.mainView = new MasterView({
            controller: this.mainController
        });

        this.userSessionController = new UserSessionController();
        this.userSessionController.authAnonymous();

        this.body.show(this.mainView);
        this.mainController.mainContent = this.mainView.mainContent;

        new Router({
            controller: this.mainController
        });
    });

    App.on('start', function() {
        $.ajaxSetup({
            cache: false,
            crossDomain: true,
            dataType: 'jsonp',
            headers: {
                'Authorization': 'session id here'
            },
            statusCode: {
                // Forbidden
                403: function() {
                    Backbone.history.navigate('login', {trigger: true});
                }
            }
        });

        Backbone.history.start({ pushState: false, root: '/' });
    });


    App.start();
});
