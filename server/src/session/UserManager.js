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
            saveSession: {
                type: Boolean,
                default: false
            },

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
            if (propName.charAt(0) !== '_' && propName !== 'authToken') {
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
            if (user.saveSession === false || user.anonymous === true) {
                user.authToken = "";
            }
            if (user.anonymous === true) {
                this._UserModel
                    .remove({_id: id})
                    .exec(this._removeUserCB);
                return true;
            }
        } 
        return false;
    },
    _handleAuthPut: function(body, authUser, dbCallback) {
        if(body){
            var userId = body._id;
            var updatedUser = this._stripInternalProperties(body);

            if (userId === authUser.id) {
                this.updateById(authUser.id, authUser.anonymous, updatedUser, dbCallback);
            } else {
                console.log("Error: authToken user id doesn't match the request user id");
                dbCallback(400);
            }
        }else{
            dbCallback(400);
        }
    },
    _handleAuthPatch: function(body, authUser, dbCallback) {
        if(body){
            var updatedUser = this._stripInternalProperties(body);
            this.updateById(authUser.id, authUser.anonymous, updatedUser, dbCallback);
        }else{
            dbCallback(400);
        }
    },
    _handleAuthGet: function(query, authUser, dbCallback) {
        if(query &&
            query.login &&
            query.password &&
            (!query.anonymous || query.anonymous === false))
        {
            this.userSession.authUser(query.login, query.password, dbCallback);
        }else if (query && query.id){
            this.findByID(query.id, dbCallback);
        }else if (authUser && authUser.id && !query.id){
            dbCallback(null, authUser);
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
    _handleAuthReq: function(req, res, authUser, dbCallback) {
        if(req.method === 'PATCH') {
            this._handleAuthPatch(req.body, authUser, dbCallback);
        }else if(req.method === 'PUT') {
            this._handleAuthPut(req.body, authUser, dbCallback);
        }else if (req.method === 'GET') {
            this._handleAuthGet(req.query, authUser, dbCallback);
        }else{
            console.log("Unsupported method: " + req.method + " for authenticated user route");
            res.sendStatus(405);
        }
    },
    _handleUnauthReq: function(req, res, dbCallback) {
        if (req.method === 'POST') {
            this._handleUnauthPost(req.body, dbCallback);
        }else if (req.method === 'GET') {
            this._handleUnauthGet(req.query, dbCallback);
        }else{
            console.log("Unsupported method: " + req.method + " for user route");
            res.sendStatus(405);
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
    _handleRoute: function(req, res) {
        var authToken = this.userSession.getRequestToken(req);
        var dbCallback = this._getDBCallbackF(res);
        
        if (authToken.length > 0) {
            var self = this;
            this.findByAuthToken(authToken, function (err, authUser) {
                if (err || !authUser) {
                    return res.sendStatus(400);
                }else{
                    self._handleAuthReq(req, res, authUser, dbCallback);
                }
            });
        }else{
            this._handleUnauthReq(req, res, dbCallback);
        }
    },
    getRouteF: function() {
        var self = this;

        /* this function should be replace with _.bindAll or something */

        return function (req, res) {
            return self._handleRoute(req, res);
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
    findById: function (userId, callback) {
        this._UserModel
            .findOne({
                _id: userId
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
    updateById: function (id, anonymous, userChanges, callback) {
        var user = userChanges || {};
        var userDeleted = false;

        /* If an anonymous user status changes to
         * offline it will be deleted from DB and 
         * should not be updated. */
        if (anonymous && user.status) {
            user.anonymous = true;
            userDeleted = this._handleStatusChange(id, user, user.status);
        }

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
