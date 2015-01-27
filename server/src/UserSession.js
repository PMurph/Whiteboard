'use strict';

var crypto = require('crypto');

var UserSession = function (db) {
        var userSchema = new db.Schema({
            name: String,

            login: String,
            passwordHash: String,

            anonymous: Boolean,

            authToken: String 
        },{
            id: true,
            toJSON: true
        });

       this._UserModel = db.model('User', userSchema);
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
    _createAnonymousUser: function(name, token) {
        var anonUser = new this._UserModel({
            name: name,
            anonymous: true,
            authToken: token
        });

        anonUser.save(this._mongoCallbackF);

        return anonUser;
    },
    _authAnonymous: function(req, res) {
        var token = this._createAuthToken();
        var name = req.body.name || "Anonymous User";
        var anonUserDoc = this._createAnonymousUser(name, token);

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
    getRouteF: function() {
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
