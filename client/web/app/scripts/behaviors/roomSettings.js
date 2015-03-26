
define([
    'app',
    'marionette'
], function (
    App,
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
                var name = this.view.ui.roomNameTxt.val();
                var type = null;
                var allowAnon = null;

                if (this.view.ui.privPublicR.is(':checked')){
                    type = "public";
                }else if(this.view.ui.privPrivateR.is(':checked')) {
                    type = "private";
                }else{
                    throw "Must select privacy setting for room";
                }

                if (this.view.ui.anonYesR.is(':checked')){
                    allowAnon = true;
                }else if(this.view.ui.anonNoR.is(':checked')) {
                    allowAnon = false;
                }else{
                    throw "Must select allow anonymous setting for room";
                }
                newRoom.setName(name);
                newRoom.setType(type);
                newRoom.setAllowAnon(allowAnon);
            } catch (e) {
                this._setStatus("Error: " + e); 
                return;
            }

            newRoom
                .save({
                    authToken: App.userSessionController._authToken
                },{
                    wait: true   
                })
                .then(function(response) {
                    var roomId = response.roomId;
                    App.mainController.router.navigate("/room/" + roomId,{trigger: true});
                })
                .fail(function(response) {
                    self._setStatus("Error: " + response);
                });
        }

    });

    return RoomSettingsBehavior;
});
