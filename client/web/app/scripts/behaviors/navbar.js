
define([
    './../app',
    'jquery',
    'backbone',
    'marionette',
    'views/userSettings'
], function (App,
     $,
     Backbone,
     Marionette,

     UserSettingsView
) {
    'use strict';

    var NavbarBehavior = Marionette.Behavior.extend({
        events: {
            "click @ui.loginButton": "showLogin",
            "click @ui.userSettingsButton": "showUserSettings"
        },
        _hideCBFactory: function() {
            var self = this;

            if (this.__hideCB) {
                return this.__hideCB;
            }else{
                this.__hideCB = function(event) {
                    self.hideUserSettings();
                };

                return this.__hideCB;
            }
        },
        showUserSettings: function(event) {
            var self = this;
            var offset = this.view.ui.userSettingsButton.offset();
            var userSettingsView;

            offset.top += 30;
            offset.left += 10;

            this.view.ui.userSettings.css(offset);

            event.stopPropagation();

            userSettingsView = new UserSettingsView();
            userSettingsView.on("attach", function() {
                document.addEventListener("click", self._hideCBFactory());
            });
            this.view.getRegion('userSettings').show(userSettingsView);

        },
        hideUserSettings: function() {
            document.removeEventListener("click", this._hideCBFactory());
            this.view.getRegion('userSettings').empty();
        },
        showLogin: function() {
            console.log("Login popup");
        }
    });

    return NavbarBehavior;
});

