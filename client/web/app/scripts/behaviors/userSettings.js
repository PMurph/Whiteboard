
define([
    'jquery',
    'backbone',
    'marionette',
    'app',
    'views/editUser'
], function (
    $,
    Backbone,
    Marionette,

    App,

    EditUserView
) {
    'use strict';

    var UserSettingsBehavior= Marionette.Behavior.extend({
        initialize: function() {
            
        },
        events: {
            "click @ui.changeDisplayNameButton": "showEditDisplayName"
        },
        showEditDisplayName: function() {
            var user = App.userSessionController.getUser();
            
            if(this.view.ui.changeDisplayNameButton.hasClass("selected")){
                this.view.ui.changeDisplayNameButton.removeClass("selected");
                this.view.ui.subMenu.removeClass("showSubmenu");
            }else{
                this.view.ui.changeDisplayNameButton.addClass("selected");
                this.view.ui.subMenu.addClass("showSubmenu");

                this.view.getRegion("subMenu").show(new EditUserView({
                    model: user
                }));
            }
        }
    });

    return UserSettingsBehavior;
});

