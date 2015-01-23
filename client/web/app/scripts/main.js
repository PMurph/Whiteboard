require([
    'jquery',
    'backbone',
    'app',
    'marionette'
],

function ($, Backbone, App) {
    'use strict';

    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    App.start();

    Backbone.history.start({ pushState: false, root: App.root });
});
