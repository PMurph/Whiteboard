
define([
    'jquery',
    'backbone',
    'marionette',
    'app',
    'views/editUser',

    'tpl!templates/settings/editDisplayName.html',
    'tpl!templates/settings/editUsername.html',
    'tpl!templates/settings/editPassword.html'
], function (
    $,
    Backbone,
    Marionette,

    App,

    EditUserView,

    EditDisplayNameTemplate,
    EditUsernameTemplate,
    EditPasswordTemplate
) {
    'use strict';

    var UserSettingsBehavior= Marionette.Behavior.extend({
        initialize: function() {
            this._user = App.userSessionController.getUser();

            this._currentSubMenu = null;

            this._submenus = {
                displayName: {
                    id: "modifyDisplayName",
                    template: EditDisplayNameTemplate,
                    button: "changeDisplayNameButton"
                },
                username: {
                    id: "modifyUsername",
                    template: EditUsernameTemplate,
                    button: "changeUsernameButton"
                },
                password: {
                    id: "modifyPassword",
                    template: EditPasswordTemplate,
                    button: "changePasswordButton"
                },
            };
        },
        events: {
            "click @ui.changeDisplayNameButton": "showEditDisplayName",
            "click @ui.changeUsernameButton": "showEditUsername",
            "click @ui.changePasswordButton": "showEditPassword"
        },
        setStatus: function(newStatus) {
            var status = newStatus.replace(/ /g, '\u00a0');
            this.view.ui.subStatusLabel.html(status);
        },
        _getButton: function(buttonName) {
            return this.view.ui[buttonName];
        },
        _toggleSubMenu: function(submenu) {
            var subMenuDiv = this.view.ui.subMenu;
            var button = this._getButton(submenu.button);

            if(this._currentSubMenu === submenu){
                button.removeClass("selected");
                subMenuDiv.removeClass("showSubmenu");

                this._currentSubMenu = null;
            }else{
                if (this._currentSubMenu) {
                    var currentButton = this._getButton(this._currentSubMenu.button);

                    currentButton.removeClass("selected");
                    this.setStatus("");
                }

                button.addClass("selected");
                subMenuDiv.addClass("showSubmenu");
                this.view.getRegion("configBox").show(new EditUserView({
                    menuId: submenu.id,
                    template: submenu.template,
                    model: this._user,
                    userSettingsBehaviour: this
                }));

                this._currentSubMenu = submenu;
            }
        },
        showEditDisplayName: function() {
            this._toggleSubMenu(this._submenus.displayName);
        },
        showEditUsername: function() {
            this._toggleSubMenu(this._submenus.username);
        },
        showEditPassword: function() {
            this._toggleSubMenu(this._submenus.password);
        }
    });

    return UserSettingsBehavior;
});

