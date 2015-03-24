
define([
    'marionette'
], function (
     Marionette
) {
    'use strict';

    var RoomSettingsBehavior = Marionette.Behavior.extend({
        events: {
            "click @ui.privPrivateR": "setRoomPrivate",
            "click @ui.privPublicR": "setRoomPublic",
            "click @ui.submitBtn": "createRoom"
        },

        _setStatus: function(text) {
            var statusLabel = this.view.ui.statusText;
            statusLabel.html(text);
            statusLabel.addClass("error");
        },

        _setDisableAllowAnon: function(b) {
            this.view.ui.anonYesR.attr('disabled', b);
            this.view.ui.anonNoR.attr('disabled', b);
        },

        setRoomPrivate: function() {
            this._setDisableAllowAnon(true);
            this.view.ui.anonNoR.prop('checked', true);
        },

        setRoomPublic: function() {
            this._setDisableAllowAnon(false);
        },

        createRoom: function() {
            var newRoom = this.view.model;
            
            try {
                newRoom.setName(this.view.ui.roomNameTxt.val());
            } catch (e) {
                this._setStatus("Error: " + e); 
                return;
            }
            newRoom.save();
        }

    });

    return RoomSettingsBehavior;
});
