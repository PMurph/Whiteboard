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
    	url: '/api/room',
    	
        initialize: function() {
            this._messages = [];
            this._drawModels = [];
            this.users = []; // collections;
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
        },

        getListOfUsersActiveInRoom: function(){
            return this.users;
        }
    });

    var Messages = Backbone.Collection.extend({
        model: Song
    });

    return MeetingRoomModel;
    // socket IO stuff here
});