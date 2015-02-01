define([
    'marionette',
    'views/dashboard/room'
], function(
    Marionette,
    RoomItemView) {
    'use strict';

    return Marionette.CollectionView.extend({
        childView: RoomItemView,

        className: 'pure-g'
    });
});
