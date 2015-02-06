define([
    'jquery',
    'underscore',
    'marionette',
    'app',
    'tpl!templates/navbar.html'
], function(
    $,
    _,
    Marionette,
    App,
    template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: function() {
            var user;
            if (App.userSessionController) {
                user = App.userSessionController.getUser();
            }

            if (user) {
                return template({displayName: user.getDisplayName(), anonymous: user.isAnonymous()});
            }else{
                return template({displayName: null, anonymous: null});
            }
        }
    });
});
