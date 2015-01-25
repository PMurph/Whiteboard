'use strict';

var Backbone = require("backbone"),
    mongoose = require("mongoose");

var RoomFactory = Backbone.Model.extend({
    initialize: function() {
        this.roomSchema = new mongoose.Schema({
            user: String
        },{
            user: true,
            toJSON: true
        });
       this.RoomModel = mongoose.model('RoomFactory', this.roomSchema);
    },
    _mongoCallbackF: function() {
        return function(err) {
            if (err) {
                console.error(err);
            }
        };
    },
    _createNewRoom: function(user) {
        var anonUser = new this.RoomModel({
            this.user: user,
            anonymous: true
        });

        anonUser.save(this._mongoCallbackF);

        return anonUser;
    },
});

module.exports = RoomFactory;