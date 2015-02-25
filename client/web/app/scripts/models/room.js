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

    var MessagesList = Backbone.Collection.extend({
        model: ChatMessage
    });

    var DrawModelsList = Backbone.Collection.extend({
        model: DrawModel
    });

    var UsersList = Backbone.Collection.extend({
        model: User
    });

    var MeetingRoomModel = Backbone.Model.extend({
    	url: '/api/room',

        initialize: function() {
            this._messages = new MessagesList();
            this._drawModels = new DrawModelsList();
            this.users = new UsersList(); // collections;
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
    // socket IO stuff here
});