
define([
    'app',
    'marionette',
    'tpl!templates/dashboard/toolbar.html'
], function(
    App,
    Marionette,
    template
) {
    'use strict';

    return Marionette.ItemView.extend({
        initialize: function(options) {
            this._dashbaordLayout = options.layout;
        },

        template: function() {
            var user;
            if (App.userSessionController) {
                user = App.userSessionController.getUser();
            }

            if (user) {
                return template({anonymous: user.isAnonymous()});
            }else{
                return null;
            }
        },

        ui: {
            "refreshBtn": "#refreshRoomListBtn",
            "createRoomBtn": "#createRoomBtn"
        },

        events: {
            "click @ui.refreshBtn": "refreshRooms"
        },

        refreshRooms: function() {
            this._dashbaordLayout.populateRooms();
        }
    });
});
