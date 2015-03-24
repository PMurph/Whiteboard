 define([
    'backbone',
    'models/DrawTools'
], function (
    Backbone,
    DrawTools) {
    "use strict";

    return Backbone.Model.extend({
        initialize: function() {
            this._drawingTools = new DrawTools();
            this.vertices = [];
        },

        addCoordinate: function(x, y) {
            var newCoord = {x:x, y:y};
            this.vertices.push(newCoord);
        },

        setColour: function(newColour) {
            return this._drawingTools.setColour(newColour);
        },

        setToolType: function(newTool) {
            return this._drawingTools.setToolType(newTool);
        },

        setThickness: function(newThickness) {
            return this._drawingTools.setThickness(newThickness);
        },

        getColour: function(){
            return this._drawingTools.getColour();
        },

        getToolType: function(){
            return this._drawingTools.getToolType();
        },

        getThickness: function(){
            return this._drawingTools.getThickness();
        },

        getListOfCoordinates: function(){
            return this.vertices;
        },

        toJSON: function() {
            return {
                vertices: this.getListOfCoordinates(),
                tool: {
                    colour: this.getColour(),
                    thickness: this.getThickness(),
                    type: this.getToolType()
                }
            };
        }
    });
});
