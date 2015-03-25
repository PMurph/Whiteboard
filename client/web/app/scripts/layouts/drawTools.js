define([
    'jquery',
    'marionette',
    'vent',
    'models/DrawModel',
    'tpl!/scripts/templates/drawTools.html'
], function(
    $,
    Marionette,
    vent,
    DrawToolModel,
    Template) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: Template,

        className: 'draw-tools',

        events: {
            'click .selectable-tool': '_setTool',
            'click .tool': 'getDrawTool',
            'click .colour-tile': '_setColour'
        },

        ui: {
            'size': '#size',
            'colour': '#colour'
        },

        _setTool: function(e) {
            $('.selected').removeClass('selected');
            $('#' + e.target.id).addClass('selected');
        },

        _setColour: function(e) {
            $('.selected-colour').removeClass('selected-colour');
            $('#' + e.target.id).addClass('selected-colour');
        },

        getDrawModel: function() {
            var drawTool = new DrawToolModel();

            drawTool.setColour($('.selected-colour').attr('id'));
            drawTool.setThickness(this.ui.size.val());
            drawTool.setToolType($('.selected').attr('id'));

            return drawTool;
        }
    });
});
