
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
        ui: {
            roomNameTxt: "#roomNameText",
            privPublicR: "#privacyPublicRadio",
            privPrivateR: "#privacyPrivateRadio",
            anonYesR: "#anonYesRadio",
            anonNoR: "#anonNoRadio",
            statusText: "#roomSettingsStatusText",
            submitBtn: "#roomSubmitBtn"
        },
        behaviors: {
            roomSettings: {
                behaviorClass: RoomSettingsBehavior
            }
        }
    });
});
