"use strict";


var UserRequest = function (userManager, userSession) {
    this.userManager = userManager;
    this.userSession = userSession || userManager.userSession;
};

UserRequest.prototype = {
    _stripInternalProperties: function(obj) {
        var cleanObj = {};

        for(var propName in obj) {
            if (propName.charAt(0) !== '_' && propName !== 'authToken') {
                cleanObj[propName] = obj[propName];
            }
        }

        return cleanObj;
    },
    _handleAuthPut: function(body, authUser, dbCallback) {
        if(body){
            var userId = body._id;
            var changes = this._stripInternalProperties(body);

            if (userId === authUser.id) {
                this.userManager.updateUser(authUser, changes, dbCallback);
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
            var changes = this._stripInternalProperties(body);
            this.userManager.updateUser(authUser, changes, dbCallback);
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
            this.userManager.findByID(query.id, dbCallback);
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
            this.userManager.findByAuthToken(authToken, function (err, authUser) {
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
    }
};

module.exports = UserRequest;