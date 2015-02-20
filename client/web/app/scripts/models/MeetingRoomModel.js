 define([
    'backbone', 
    './DrawModel', 
    './User', 
    './ChatMessage'], 
    function (
        Backbone,
        DrawModel, 
        User, 
        ChatMessage) {
    "use strict";

    var MeetingRoomModel = Backbone.Model.extend({

        initialize: function() {
            this._messages = [];
            this._drawModels = [];
            this._users = [];
        },

        addUser: function(newUser) {
            if (newUser instanceof User)
            {  
                this._users.push(newUser);
            }
        },

        addDrawing: function(newDraw){
            if (newDraw instanceof DrawModel)
            {
                this._drawModels.push(newDraw);
            }
        },

        addMessage: function(newMsg){
            if (newMsg instanceof ChatMessage)
            {
                this._messages.push(newMsg);
            }
        }
    });

    return MeetingRoomModel;
});