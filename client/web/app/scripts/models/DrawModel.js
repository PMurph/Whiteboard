 define(['backbone', 'models/DrawTools'], function (Backbone, DrawTools) {
    "use strict";

    var DrawModel = Backbone.Model.extend({
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

        setTool: function(newTool) {
            return this._drawingTools.setTool(newTool);
        },

        setThickness: function(newThickness) {
            return this._drawingTools.setThickness(newThickness);
        },

        getColour: function(){
            return this._drawingTools.getColour();
        },

        getTool: function(){
            return this._drawingTools.getTool();
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
                tool: this.getTool(),
                colour: this.getColour(),
                thickness: this.getThickness()
            };
        }
    });

    return DrawModel;
});
