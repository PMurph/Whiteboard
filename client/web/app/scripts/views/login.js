define([
    'jquery',
    'underscore',
    'marionette',
    'behaviors/login',
    'tpl!templates/login.html'
], function(
    $,
    _,
    Marionette,
    LoginBehavior,
    Template
) {
    'use strict';

    return Marionette.ItemView.extend({
        template: Template,
        ui: {
            closeButton: "#closeLoginBtn"
        },
        behaviors: {
            login: {
                behaviorClass: LoginBehavior
            }
        }

    });
});
