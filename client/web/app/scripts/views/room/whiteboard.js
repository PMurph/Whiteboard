define([
    'marionette',
    'underscore'
], function(
    Marionette,
    _) {
    'use strict';

    return Marionette.ItemView.extend({
        template: _.template(''),
        tagName: 'canvas'
    });
});
