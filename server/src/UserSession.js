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
        var token = this._createAuthToken();
        var anonUserDoc = this._createAnonymousUser(token);

        res.json(anonUserDoc.toObject());
    },
    _handlePost: function(req, res) {
        if(req.body &&
            req.body.anonymous === true &&
            (req.body.authToken === undefined || req.body.authToken === null))
        {
            this._authAnonymous(req, res);
        }else{
            res.sendStatus(400);
        }
    },
    _handleGet: function(req, res) {
        if(req.body &&
            (req.body.authToken === undefined || req.body.authToken === null))
        {
            //
        }else{
            res.sendStatus(400);
        }
    },
    routeF: function() {
        var self = this;

        return function (req, res) {
            if(req.method === 'POST'){
                self._handlePost(req, res);
            }else if (req.method === 'GET') {
                self._handleGet(req, res);
            }else{
                console.log("Unsupported method: " + req.method + "i for user route");
                res.sendStatus(405);
            }
        };
    }
};

module.exports = UserSession;
