
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
            "click @ui.userSettingsButton": "showUserSettings",
            "mousedown @ui.userSettingsButton": "stopSelection",
            "mousedown @ui.loginButton": "stopSelection"
        },
        stopSelection: function(event) {
            event.preventDefault();
        },
        _hideCBFactory: function() {
            var self = this;

            if (this.__hideCB) {
                return this.__hideCB;
            }else{
                this.__hideCB = function(event) {
                    var id = self.view.ui.userSettings.attr('id'),
                        search = "#" + id,
                        target = $(event.target),
                        parents = target.parents(search);

                    if (parents.length === 0 && target.attr('id') !== id) {
                        self.hideUserSettings();
                    }
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
            this.view.ui.userSettings.addClass("show");

            event.stopPropagation();

            userSettingsView = new UserSettingsView();
            userSettingsView.on("attach", function() {
                document.addEventListener("click", self._hideCBFactory());
            });
            this.view.getRegion('userSettings').show(userSettingsView);

        },
        hideUserSettings: function() {
            this.view.ui.userSettings.removeClass("show");
            document.removeEventListener("click", this._hideCBFactory());
        },
        showLogin: function() {
            console.log("Login popup");
        },
        hideLogin: function() {

        }
    });

    return NavbarBehavior;
});

