"use strict";

var crypto = require('crypto');

var UserManager = function (db) {
    this._setupDB(db);
};

UserManager.prototype = {
    MIN_PASSWORD_LENGTH: 5,
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

        if (userSchema.options) { 
            userSchema.options.toObject = {};
            userSchema.options.toObject.transform = function (doc, ret, options) {
                if (options.hide) {
                    options.hide.split(' ').forEach(function (prop) {
                        delete ret[prop];
                    });
                }
            };
        }
        this._UserModel = db.model('User', userSchema);
    },
    _removeUserCB: function(err) {
        if (err) {
            console.log("Error: " + err);
        }
    },
    _handleStatusChange: function(user, newStatus) {
        if (newStatus !== "offline" && newStatus !== "online" && newStatus !== "away") {
            throw "The status entered is invalid";
        }

        if (newStatus === "offline") {
            if (user.saveSession === false || user.anonymous === true) {
                user.authToken = "";
            }
            if (user.anonymous === true) {
                this._UserModel
                    .remove({_id: user.id})
                    .exec(this._removeUserCB);
                return true;
            }
        } 
        return false;
    },
    _isUsernameTaken: function (name, callback) {
        this._UserModel
            .find({login: name})
            .limit(1)
            .exec(callback);
    },
    _checkPassword: function (password) {
        if (password.length < this.MIN_PASSWORD_LENGTH) {
            return false;   
        }

        return true;
    },
    hashPassword: function(password) {
        var hash = crypto.createHash('sha256');

        hash.update("wbpassword");
        hash.update(password);
        hash.update("$aal1ttt&");

        return hash.digest('base64');
    },
    createAnonymousUser: function (name, token, callback) {
      var anonUserDoc = new this._UserModel({
          displayName: name,
          anonymous: true,
          authToken: token
      });

      anonUserDoc.save(callback);

      return anonUserDoc;
    },
    findByLogin: function (login, password, callback) {
        var passwordHash = this.hashPassword(password);
        this._UserModel
            .findOne({
                login: login,
                passwordHash: passwordHash
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
    updateUser: function (user, userChanges, callback) {
        var userDeleted = false;

        /* If an anonymous user status changes to
         * offline it will be deleted from DB and 
         * should not be updated. */
        if (userChanges.status) {
            try {
                userDeleted = this._handleStatusChange(user, userChanges.status);
            } catch (e) {
                callback(e);
                return;
            }
            if (userDeleted) {
                callback(200);
                return;
            }
            userChanges.authToken = user.authToken;
        }
        
        /* User register on site by upgrading account
         * from anonymous: true to false. The upgrade
         * also requires a login and password to be set */
        if(userChanges.anonymous !== user.anonymous) {
            if (userChanges.anonymous === false) {
                if ((!userChanges.password && !userChanges.b64password) || !userChanges.login) {
                    callback("Login and Password must be set to register regular user.");
                    return;
                }
            }else{
                callback(400);
                return;
            }
        }else if (user.anonymous === true && (userChanges.login || userChanges.password || userChanges.b64password)) {
            callback(400);
            return;
        }

        if (userChanges.password || userChanges.b64password) {
            var password = userChanges.password || (new Buffer(userChanges.b64password, 'base64')).toString();
            if (!this._checkPassword(password)) {
                callback("Password is too short must be at least " + this.MIN_PASSWORD_LENGTH + " characters");
                return;
            }
            userChanges.passwordHash = this.hashPassword(password);
            delete userChanges.password;
            delete userChanges.b64password;
        }

        if (userChanges.login && userChanges.login !== user.login) {
            var self = this;
            var newLogin = userChanges.login;
            this._isUsernameTaken(newLogin, function (err, users) {
                if (users.length > 0) {
                    callback("The username is already taken");
                }else{
                    self._UserModel
                        .findByIdAndUpdate(user.id, {$set: userChanges})
                        .exec(callback);
                }
            });
            return;
        }

        this._UserModel
            .findByIdAndUpdate(user.id, {$set: userChanges})
            .exec(callback);

    }
};

module.exports = UserManager;
