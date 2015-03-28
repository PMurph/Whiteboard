
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
        setStatus: function(type, newStatus, imageSrc) {
            var statusLabel = this.view.ui.subStatusLabel;
            var errorType = false;

            statusLabel.removeClass("error message");
            if (type === "message") {
                statusLabel.addClass("message");
            } else if (type === "error") {
                statusLabel.addClass("error");
                errorType = true;
                imageSrc = "images/error.svg";
            } else if (type === "clear"){
                return statusLabel.empty();
            } else {
                throw "Unkown status type(" + type.toString() + ")";
            }
            var status = newStatus.replace(/ /g, '\u00a0');
            var imageHTML = (imageSrc) ? "<img src='" + imageSrc + "' height='25px'></img>" : "";
            if (errorType) {

                statusLabel.html(imageHTML + "&nbsp;" + status);
            }else{
                statusLabel.html(status + "&nbsp;" + imageHTML);
            }
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
                    this.setStatus("clear");
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

