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
            this.users = []; // collections;
        },

        addActiveUserToRoom: function(newUser) {
            if (newUser instanceof User)
            {  
                this.users.push(newUser);
            }
        },

        removeUserFromRoom: function(user){
            var index = this._users.indexOf(user);

            if (index > -1) {
                this._users.splice(index, 1);
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
        },

        getListOfUsersActiveInRoom: function(){
            return this.users;
        }
    });

    return MeetingRoomModel;
});