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
        var anonUserDoc = new this._UserModel({
            name: name,
            anonymous: true,
            authToken: token
        });

        anonUserDoc.save(this._mongoCallbackF);

        return anonUserDoc;
    },
    _authAnonymous: function(displayName) {
        var token = this._createAuthToken();
        var name = displayName || "Anonymous User";
        var anonUserDoc = this._createAnonymousUser(name, token);

        return anonUserDoc.toObject();
    },
    _handlePost: function(body) {
        if(body &&
            body.anonymous === true &&
            (body.authToken === undefined || body.authToken === null))
        {
            return this._authAnonymous(body.name);
        }else{
            return 400;
        }
    },
    _handleGet: function(body) {
        if(body &&
            (body.authToken === undefined || body.authToken === null))
        {
            return {};
        }else{
            return 400;
        }
    },
    getRouteF: function() {
        var self = this;

        return function (req, res) {
            var result;

            if(req.method === 'POST'){
                result = self._handlePost(req.body);
            }else if (req.method === 'GET') {
                result = self._handleGet(req.body);
            }else{
                console.log("Unsupported method: " + req.method + "i for user route");
                result = 405;
            }

            if (result instanceof Object) {
                res.json(result);
            }else if (!isNaN(result)) {
                res.sendStatus(result);
            }else{
                console.log("Unspported result from method handler Result: " + String(result));
                res.sendStatus(500);
            }
        };
    }
};

module.exports = UserSession;
