
define([
    'marionette',
    'behaviors/roomInvites',
    'tpl!templates/roomInvites.html'
], function(
    Marionette,
    RoomInvitesBehavior,
    Template
) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,

        behaviors: {
            roomInvites: {
                behaviorClass: RoomInvitesBehavior
            }
        }
    });
});
