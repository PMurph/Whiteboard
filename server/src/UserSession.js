'use strict';

var mongoose = require("mongoose"),
               crypto = require('crypto');
var UserSession = function () {
        this.userSchema = new mongoose.Schema({
            name: String,

            login: String,
            passwordHash: String,

            anonymous: Boolean,

            authToken: String 
        },{
            id: true,
            toJSON: true
        });

       this.UserModel = mongoose.model('User', this.userSchema);
};

UserSession.prototype = {
    _mongoCallbackF: function() {
        return function(err) {
            if (err){
                console.error(err);
            }
        };
    },
    _createAuthToken: function() {
        var hash = crypto.createHash('sha256');

        hash.update(Date.now().toString());
        hash.update(Math.random().toString());
        hash.update("salty");

        return hash.digest('hex');
    },
    _createAnonymousUser: function(token) {
        var anonUser = new this.UserModel({
            name: "Anon",
            anonymous: true,
            authToken: token
        });

        anonUser.save(this._mongoCallbackF);

        return anonUser;
    },
    _authAnonymous: function(req, res) {

        if(req.method === 'POST') {
            var token = this._createAuthToken();
            var anonUserDoc = this._createAnonymousUser(token);

            res.json(anonUserDoc.toObject());
        }else if (req.method === 'GET') {
            console.log("HEEHEH");
        }else{
            console.log("Unsupported method");
        }
    },
    authAnonymousRouteF: function() {
        var instance = this;

        return function (req, res) {
            instance._authAnonymous(req, res);
        };
    }
};

module.exports = UserSession;
