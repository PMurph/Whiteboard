define([
    'marionette',
    'tpl!../templates/controls.html',
], function(
    Marionette,
    Template) {
    'use strict';
    
    return Marionette.LayoutView.extend({
        template: Template,
        
        className: 'controls-container',
        
        onShow: function() {
            this._setupControls();
        },
        
        _setupControls: function() {
            this._setupCreateButton();
        },
        
        _setupCreateButton: function() {
            $("#create-room-btn").click(function() {
                console.log("Clicked");
            });
        }
    });
});