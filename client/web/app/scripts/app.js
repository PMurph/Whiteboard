define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'controllers/MainController',
    'routers/MainRouter',
    'controllers/UserSession',
    'views/master'
], function (
    $,
    _,
    Backbone,
    Marionette,
    Controller,
    Router,
    MasterView) {
    'use strict';

    var App = new Marionette.Application();

    App.addRegions({
        'body': 'body'
    });

    App.addInitializer(function() {
        var mainView = new MasterView();
        var controller = new Controller();

        this.userSessionController = new UserSessionController();

        App.body.show(mainView);
        controller.mainContent = mainView.mainContent;

        new Router({
            controller: controller
        });
    });

    App.addInitializer(function() {
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

    return App;
});
