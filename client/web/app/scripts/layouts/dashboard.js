define([
    'app',
    'marionette',
    'collections/rooms',
    'views/dashboard/toolbar',
    'views/dashboard/rooms',
    'tpl!templates/dashboard/dashboard.html'
], function(
    App,
    Marionette,
    RoomsCollection,

    ToolbarView,
    RoomsCollectionView,
    Template
) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,
        className: 'content-container',

        regions: {
            toolbar: '#toolbarRegion',
            roomListRegion: '#roomListRegion',
        },

        ui: {
            "roomListSpinner": "#roomListSpinner"
        },

        onShow: function() {
            this.toolbar.show(new ToolbarView({
                layout: this   
            }));
            this.populateRooms();
        },

        populateRooms: function() {
            var self = this;

            this.ui.roomListSpinner.show();
            this.roomListRegion.empty();

            this.collection = new RoomsCollection();
            this.collection
                .fetch()
                .then(function () {
                    self.ui.roomListSpinner.hide();
                });

            var collectionView = new RoomsCollectionView({
                collection: this.collection
            });
            this.roomListRegion.show(collectionView);
        },
    });
});
