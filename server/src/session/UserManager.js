"use strict";

var UserSession = require("./UserSession");

var UserManager = function (db) {
    this.userSession = new UserSession(this);

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
        userSchema.options.toObject = {};
        userSchema.options.toObject.transform = function (doc, ret, options) {
            if (options.hide) {
                options.hide.split(' ').forEach(function (prop) {
                    delete ret[prop];
                });
            }
        };
        this._UserModel = db.model('User', userSchema);
    },
    _removeUserCB: function(err) {
        if (err) {
            console.log("Error: " + err);
        }
    },
    _handleStatusChange: function(user, newStatus) {
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
    _checkPassword: function (password) {
        if (password.length < this.MIN_PASSWORD_LENGTH) {
            return false;   
        }

        return true;
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
        var passwordHash = this.userSession.hashPassword(password);
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
            userDeleted = this._handleStatusChange(user, userChanges.status);
            userChanges.authToken = user.authToken;
        }

        if (userChanges.password || userChanges.b64password) {
            var password = userChanges.password || (new Buffer(userChanges.b64password, 'base64')).toString();
            if (!this._checkPassword(password)) {
                callback("Password is too short must be at least " + this.MIN_PASSWORD_LENGTH + " characters");
                return;
            }
            userChanges.passwordHash = this.userSession.hashPassword(password);
            delete userChanges.password;
            delete userChanges.b64password;
        }

        if (!userDeleted) {
            this._UserModel
                .findByIdAndUpdate(user.id, {$set: userChanges})
                .exec(callback);
        } else {
            callback(200);
        }

    }
};

module.exports = UserManager;
