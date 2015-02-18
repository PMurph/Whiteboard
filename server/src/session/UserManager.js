"use strict";

var UserSession = require("./UserSession");

var UserManager = function (db) {
    this.userSession = new UserSession(this);

    this._setupDB(db);
};

UserManager.prototype = {
    _setupDB: function(db) {
        var userSchema = new db.Schema({
            displayName: String,

            login: String,
            passwordHash: String,

            anonymous: Boolean,

            authToken: String,
            status: String,

            createdOn: { 
                type: Date,
                default: Date.now 
            }
        },{
            id: true,
            toJSON: true
        });

        this._UserModel = db.model('User', userSchema);
    },
    _stripInternalProperties: function(obj) {
        var cleanObj = {};

        for(var propName in obj) {
            if (propName.charAt(0) !== '_') {
                cleanObj[propName] = obj[propName];
            }
        }

        return cleanObj;
    },
    _removeUserCB: function(err) {
        if (err) {
            console.log("Error: " + err);
        }
    },
    _handleStatusChange: function(id, user, newStatus) {
        if (newStatus === "offline") {
            user.authToken = "";
            if (user.anonymous === true) {
                this._UserModel
                    .remove({_id: id})
                    .exec(this._removeUserCB);
                return true;
            }
        } 
        return false;
    },
    _handleAuthPost: function(body, authUser, dbCallback) {
        if(body){
            var userId = body._id;
            var updatedUser = this._stripInternalProperties(body);

            if (userId === authUser.id) {
                this.updateById(authUser.id, updatedUser, dbCallback);
            } else {
                console.log("Error: authToken user id doesn't match the request user id");
                dbCallback(400);
            }
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
                console.log("Database Error:" + err);
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
          displayName: name,
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
    },
    updateById: function (id, user, callback) {
        var userDeleted = false;

        if (user.status) {
            userDeleted = this._handleStatusChange(id, user, user.status);
        }

        /* If an anonymous user status changes to
         * offline it will be deleted from DB and 
         * should not be updated. */
        if (!userDeleted) {
            this._UserModel
                .findByIdAndUpdate(id, {$set: user})
                .exec(callback);
        } else {
            callback(200);
        }

    }
};

module.exports = UserManager;
