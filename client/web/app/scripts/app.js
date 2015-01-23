define([
    'underscore',
    'backbone',
    'marionette'
],

function (_, Backbone) {
    'use strict';

    var App = new Backbone.Marionette.Application();

    App.addInitializer(function () {
        this.root = '/';
    });

    //TODO: Modify jQuery ajax to add session info

    return App;
});
