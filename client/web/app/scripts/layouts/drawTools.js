define([
    'jquery',
    'marionette',
    'vent',
    'tpl!/scripts/templates/drawTools.html'
], function(
    $,
    Marionette,
    vent,
    Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        className: 'draw-tools',

        events: {
            'click .selectable-tool': '_setTool'
        },

        _setTool: function(e) {
            $('.selected').removeClass('selected');
            $('#' + e.target.id).addClass('selected');
        }
    });
});
