define([
    'marionette',
    'collections/rooms',
    'views/dashboard/rooms',
    'tpl!templates/dashboard/dashboard.html'
], function(
    Marionette,
    RoomsCollection,
    RoomsCollectionView,
    Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        className: 'content-container',

        regions: {
            roomsListRegion: '#rooms-list-region'
        },

        onShow: function() {
            // Stub collection to show some rooms
            this.collection = new RoomsCollection();
            for (var i = 0; i < 6; i++) {
                this.collection.add({
                    name: 'room ' + i,
                    id: i
                });
            }
            var collectionView = new RoomsCollectionView({
                collection: this.collection
            });
            this.roomsListRegion.show(collectionView);
        }
    });
});
