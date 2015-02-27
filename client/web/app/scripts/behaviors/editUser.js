
define([
    'jquery',
    'backbone',
    'marionette',
    'app'
], function (
     $,
     Backbone,
     Marionette,

     App
) {
    'use strict';

    var EditUserBehavior = Marionette.Behavior.extend({
        initialize: function() {
            this.menuId = this.view.options.menuId;
        },
        events: function() {
            var events = {};

            if (this.menuId === "modifyDisplayName") {
                events["click @ui.submitButton"] = "changeDisplayName";
            } else if (this.menuId === "modifyUsername") {
                events["click @ui.submitButton"] = "changeUsername";   
            } else if (this.menuId === "modifyPassword") {
                events["click @ui.submitButton"] = "changePassword";   
            }

            return events;
        },
        _setStatus: function(type, newStatus, imageSrc) {
            this.view.userSettingsBehaviour.setStatus(type, newStatus, imageSrc);
        },
        _getUser: function() {
            return App.userSessionController.getUser();
        },
        clearStatus: function() {
            this._setStatus("clear");

            return false;
        },
        _setDisableOnFormElements: function(list, value) {
            for(var i = 0; i < list.length; i++) {
                list[i].prop("disabled", value);
            }
        },
        _handleUserSetter: function(user, setterF, newValue, formElemList) {
            try {
                var self = this;
                if (!setterF || !_.isFunction(setterF)) {
                    throw "User setter function is invalid";
                }
                this._setStatus("message", "Saving&nbsp;&nbsp;&nbsp;", "/images/ellipsis_small.svg");
                this._setDisableOnFormElements(formElemList, true);
                setterF.call(user, newValue)
                    .then(function () {
                        self._setStatus("message", "Saved Successfully"); 
                        self._setDisableOnFormElements(formElemList, false);
                    })
                    .fail(function (a, b, c) {
                        var aa = a;
                        self._setStatus("error", "Username/Login failed to set: ");
                        self._setDisableOnFormElements(formElemList, false);
                    });

            } catch (e) {
                this._setStatus("error", "Invalid: " + e);
                this._setDisableOnFormElements(formElemList, false);
            }

        },
        changeDisplayName: function() {
            var user = this._getUser(),
                nameTxt = this.view.ui.displayNameText,
                saveButton = this.view.ui.submitButton,
                newName = nameTxt.val();
            
            this._handleUserSetter(user, user.setDisplayName, newName, [nameTxt, saveButton]);
        },
        changeUsername: function() {
            var user = this._getUser(),
                loginTxt = this.view.ui.usernameText,
                saveButton = this.view.ui.submitButton,
                newLogin = loginTxt.val();
            
            this._handleUserSetter(user, user.setLogin, newLogin, [loginTxt, saveButton]);
            
        },
        changePassword: function() {
            var user = this._getUser(),
                pass1Txt = this.view.ui.password1Text,
                pass2Txt = this.view.ui.password2Text,
                saveButton = this.view.ui.submitButton;

            if (pass1Txt.val() !== pass2Txt.val()){
                this._setStatus("error", "Invalid: The passwords entered did not match");
                return;
            }
            var newPassword = pass1Txt.val();
            
            this._handleUserSetter(user, user.setPassword, newPassword, [pass1Txt, pass2Txt, saveButton]);
        }
    });

    return EditUserBehavior;
});

