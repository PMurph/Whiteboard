 define([
    'backbone',
    './DrawModel',
    './User',
    'collections/chatMessages'
 ], function (
    Backbone,
    DrawModel,
    User,
    ChatMessagesList
) {
    "use strict";

    var DrawModelsList = Backbone.Collection.extend({
        model: DrawModel
    });

    var UsersList = Backbone.Collection.extend({
        model: User
    });

    var MeetingRoomModel = Backbone.Model.extend({
        defaults: {
            name: 'Untitled Room',
        },
        idAttribute: "_id",
        url: "/api/room",
        initialize: function() {
            this._messages = new ChatMessagesList();
            this._drawModels = new DrawModelsList();
            this._users = new UsersList();
        },
        getListOfUsersActiveInRoom: function(){
            return this._users;
        },
        setName: function(newName) {
            if(!newName || newName.length === 0) {
                throw "Invalid Room Name: Name cannot be blank/empty";
            }

            if (!this.isNew()) {
                return this.save({
                    name: newName 
                },{
                    wait: true
                });
            }else{
                this.set("name", newName);
            }
        },
        getName: function() {
            return this.get("name");
        }
    });

    return MeetingRoomModel;
});
