requirejs.config({
    deps: ['main'],
    paths: {
        backbone: '../bower_components/backbone/backbone',
        jquery: '../bower_components/jquery/jquery',
        marionette: '../bower_components/marionette/lib/core/backbone.marionette',
        underscore: '../bower_components/underscore/underscore',
        'backbone.wreqr' : '../bower_components/backbone.wreqr/lib/backbone.wreqr',
        'backbone.eventbinder' : '../bower_components/backbone.eventbinder/lib/backbone.eventbinder',
        'backbone.babysitter' : '../bower_components/backbone.babysitter/lib/backbone.babysitter',
        text: '../bower_components/requirejs-text/text',
        tpl: '../bower_components/requirejs-tpl/tpl',
        'socket.io': '../bower_components/socket.io-client/socket.io',
        vent: './events/vent'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        jquery: {
            exports: '$'
        },
        marinoette: {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        'backbone.wreqr': {
            deps: ['backbone'],
            exports: 'BackboneWreqr'
        },
        text: {
            exports: 'text'
        },
        'socket.io': {
            exports: 'io'
        }

    }
});
