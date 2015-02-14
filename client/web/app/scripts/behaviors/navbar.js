
define([
    'jquery',
    'backbone',
    'marionette',
    'app',
    'views/userSettings',
    'views/login'
], function (
    $,
    Backbone,
    Marionette,

    App,

    UserSettingsView,
    LoginView
) {
    'use strict';

    var NavbarBehavior = Marionette.Behavior.extend({
        events: {
            "click @ui.loginButton": "showLogin",
            "click @ui.userSettingsButton": "showUserSettings",
            "mousedown @ui.userSettingsButton": "stopSelection",
            "mousedown @ui.loginButton": "stopSelection"
        },
        modelEvents: {
            "change:displayName": "changeDisplayName"
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
            this.view.ui.userSettings.removeClass("hide");
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
            this.view.ui.userSettings.removeClass("showSubmenu");
            this.view.ui.userSettings.addClass("hide");
            document.removeEventListener("click", this._hideCBFactory());
        },
        showLogin: function() {
            App.mainController.showShield();
            App.mainController.view.getRegion("centerBox").show(new LoginView());
        },
        hideLogin: function() {
            App.mainController.hideShield();
        },
        changeDisplayName: function(user, newDisplayName) {
            this.view.ui.userDisplayName.html(newDisplayName);
        }
    });

    return NavbarBehavior;
});

