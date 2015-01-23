define([
    'underscore',
    'backbone',
    'marionette',
    'controllers/MainController',
    'routers/MainRouter',
    'views/master'
], function (
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

        App.body.show(mainView);
        controller.mainContent = mainView.mainContent;

        new Router({
            controller: controller
        });

        Backbone.history.start({ pushState: false, root: '/' });
    });

    return App;
});
