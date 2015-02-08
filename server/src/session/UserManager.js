"use strict";

var UserSession = require("./UserSession");

var UserManager = function (db) {
    this.userSession = new UserSession(this);

    this._setupDB(db);
};

UserManager.prototype = {
    _setupDB: function(db) {
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
    },
    _handleAuthPost: function(body, authUser, dbCallback) {
        if(body){
            this.updateByID(authUser.id, body);
        }else{
            dbCallback(400);
        }
    },
    _handleAuthGet: function(query, authUser, dbCallback) {
        if (query && query.id){
            this.findByID(query.id, dbCallback);
        }else if (authUser && authUser.id && !query.id){
            this.findByID(authUser.id);
        }else{
            dbCallback(400);
        }
    },
    _handleUnauthPost: function(body, dbCallback) {
        if(body && body.anonymous === true){
            this.userSession.authAnonymous(body.name, dbCallback);
        }else{
            dbCallback(400);
        }
    },
    _handleUnauthGet: function(query, dbCallback) {
        if(query &&
            query.login &&
            query.password &&
            (!query.anonymous || query.anonymous === false))
        {
            this.userSession.authUser(query.login, query.password, dbCallback);
        }else{
            dbCallback(400);
        }
    },
    _getDBCallbackF: function(res) {
        return function(err, doc) {
            if (err && !isNaN(err)){
                res.sendStatus(err); 
            }else if(doc){
                res.json(doc.toObject());
            }else{
                res.sendStatus(500);
            }
        };
    },
    getRouteF: function() {
        var self = this;

        return function (req, res) {
            var authToken = self.userSession.getRequestToken(req);
            var dbCallback = self._getDBCallbackF(res);
            
            if (authToken.length > 0) {
                self.findByAuthToken(authToken, function (err, authUser) {
                    if (err || !authUser) {
                        return res.sendStatus(400);
                    }
                    if(req.method === 'POST') {
                        self._handleAuthPost(req.body, authUser, dbCallback);
                    }else if (req.method === 'GET') {
                        self._handleAuthGet(req.query, authUser, dbCallback);
                    }else{
                        console.log("Unsupported method: " + req.method + " for authenticated user route");
                        res.sendStatus(405);
                    }
                });
            }else{
                if (req.method === 'POST') {
                    self._handleUnauthPost(req.body, dbCallback);
                }else if (req.method === 'GET') {
                    self._handleUnauthGet(req.query, dbCallback);
                }else{
                    console.log("Unsupported method: " + req.method + " for user route");
                    res.sendStatus(405);
                }
            }
        };
    },
    createAnonymousUser: function (name, token, callback) {
      var anonUserDoc = new this._UserModel({
          name: name,
          anonymous: true,
          authToken: token
      });

      anonUserDoc.save(callback);
    },
    findByLogin: function (login, password, callback) {
      this._UserModel
         .findOne({
             login: login,
             password: password
         })
         .exec(callback);
    },
    findByAuthToken: function (authToken, callback) {
      this._UserModel
         .findOne({
             authToken: authToken
         })
         .exec(callback);
    }
};

module.exports = UserManager;
