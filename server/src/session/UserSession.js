'use strict';

var crypto = require('crypto');

var UserSession = function (userManager) {
    this.userManager = userManager;
};

UserSession.prototype = {
    _createAuthToken: function() {
        var hash = crypto.createHash('sha256');

        hash.update(Date.now().toString());
        hash.update(Math.random().toString());
        hash.update("salty");

        return hash.digest('hex');
    },
    authAnonymous: function(displayName, dbCallback) {
        var token = this._createAuthToken();
        var name = displayName || "Anonymous User";

        this.userManager.createAnonymousUser(name, token, dbCallback);
    },
    authUser: function(login, password, dbCallback) {
        var self = this;
        var searchCallback = function (err, user) {
             if (err) {
                 dbCallback(400);
                 return;
             }
             if (!user) {
                 dbCallback(403);
                 return;
             }
             var token = self._createAuthToken();
             
             user.authToken = token;
             user.status = "online";
             user.save(dbCallback);
        };

        this.userManager.findByLogin(login, password, searchCallback);
    },
    getRequestToken: function (req) {
        var authToken;

        if(req.body) {
            authToken = req.body.authToken;
        }else if (req.query) {
            authToken = req.query.authToken;
        }
        
        return authToken || "";
    },
};

module.exports = UserSession;
