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

            this.set("userInvites", []);
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
        },
        setType: function(newType) {
            if(!newType || (newType !== "public" && newType !== "private")) {
                throw "Invalid Room Type";
            }

            if (!this.isNew()) {
                return this.save({
                    type: newType
                },{
                    wait: true
                });
            }else{
                this.set("type", newType);
            }
        },
        getType: function() {
            return this.get("type");
        },
        setAllowAnon: function(newAllowAnon) {
            if(typeof newAllowAnon !== "boolean") {
                throw "Invalid Allow Anonymous: Must be boolean";
            }

            if (!this.isNew()) {
                return this.save({
                    type: newAllowAnon
                },{
                    wait: true
                });
            }else{
                this.set("allowAnon", newAllowAnon);
            }
        },
        getAllowAnon: function() {
            return this.get("allowAnon");
        },
        addUserInvite: function(userId) {
            var invites = this.getUserInvites();
            var idObj = {id: userId};

            for(var i = 0; i < invites.length; i++){
                var invite = invites[i];
                if(invite.id === userId){
                    throw "User is alreayd invited";
                }
            }

            if (!this.isNew()) {

            }else{
                invites.push(idObj);
            } 
        },
        getUserInvites: function() {
            return this.get("userInvites");
        },
        removeAllInvites: function() {
            this.set("userInvites", []);
        },
        removeUserInvite: function(userId) {
            var invites = this.getUserInvites();

            for(var i = 0; i < invites.length; i++) {
                var invite = invites[i];
                if(invite.id === userId){
                    invites.splice(i, 1);
                }
            }
        }
    });

    return MeetingRoomModel;
});
