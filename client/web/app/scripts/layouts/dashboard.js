define([
    'marionette',
    'collections/rooms',
    'views/dashboard/rooms',
    'tpl!templates/dashboard/dashboard.html'
], function(
    Marionette,
    RoomsCollection,
    RoomsCollectionView,
    Template
) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        className: 'content-container',

        regions: {
            roomsListRegion: '#rooms-list-region',
        },

        ui: {
            toolbar: "#dashboardToolbar"
        },

        onShow: function() {
            this._populateRooms();
        },

        _populateRooms: function() {
            this.collection = new RoomsCollection();
            this.collection.fetch();

            var collectionView = new RoomsCollectionView({
                collection: this.collection
            });
            this.roomsListRegion.show(collectionView);
        },
    });
});
