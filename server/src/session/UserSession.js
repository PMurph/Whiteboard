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
    hashPassword: function(password) {
        var hash = crypto.createHash('sha256');

        hash.update("wbpassword");
        hash.update(password);
        hash.update("$aal1ttt&");

        return hash.digest('base64');
    },
    authAnonymous: function(displayName, dbCallback) {
        var token = this._createAuthToken();
        var name = displayName || "Anonymous User";

        this.userManager.createAnonymousUser(name, token, dbCallback);
    },
    authUser: function(login, password, saveSession, dbCallback) {
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

            user.saveSession = saveSession || false;
            if (!user.authToken || !saveSession) {
               var token = self._createAuthToken();
               user.authToken = token;
            }
            user.status = "online";
            user.save(dbCallback);
        };

        this.userManager.findByLogin(login, password, searchCallback);
    },
    getRequestToken: function (req) {
        var authToken;

        if (req.method === "GET") {
            authToken = req.query.authToken;
        }else{
            authToken = req.body.authToken;
        }

        
        return authToken || "";
    },
};

module.exports = UserSession;
