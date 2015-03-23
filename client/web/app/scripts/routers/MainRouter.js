define(['marionette'], function(Marionette) {
    'use strict';

    return Marionette.AppRouter.extend({
        appRoutes: {
            '': 'dashboard',
            'room/:id': 'room',
            'createRoom': 'renderCreateRoom'
        }
    });
});
