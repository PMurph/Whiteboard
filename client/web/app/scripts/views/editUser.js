
define([
    'jquery',
    'underscore',
    'marionette',

    'app',

    'behaviors/editUser'
], function(
    $,
    _,
    Marionette,

    App,

    EditUser
) {
    'use strict';

    return Marionette.ItemView.extend({
        initialize: function(options) {
            this.menuId = options.menuId;
            this.userSettingsBehaviour = options.userSettingsBehaviour;
        },
        ui: {
            displayNameText: "#displayNameText",
            password1Text: "#password1Text",
            password2Text: "#password2Text",
            usernameText: "#usernameText",
            submitButton: "#submitButton"
        },
        onShow: function(){
            if(this.menuId === "modifyDisplayName") {
                this.ui.displayNameText.focus();
            }else if(this.menuId === "modifyUserName"){
                this.ui.usernameText.focus();
            }else if(this.menuId === "modifyPassword"){
                this.ui.password1Text.focus();
            }
        },
        behaviors: {
            editUser: {
                behaviorClass: EditUser
            }
        }
    });

});
