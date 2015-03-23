
define([
    'marionette',
    'behaviors/roomSettings',
    'tpl!templates/roomSettings.html'
], function(
    Marionette,
    RoomSettingsBehavior,
    Template
) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,

        behaviors: {
            roomSettings: {
                behaviorClass: RoomSettingsBehavior
            }
        }
    });
});
