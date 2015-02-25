 define(['backbone', './DrawObjects'], function (Backbone, DrawObjects) {
    "use strict";

    var DrawModel = Backbone.Model.extend({

        initialize: function() {
            this._drawingInformation = new DrawObjects();
            this._listOfCoordinates = [];
            this._thickness = 1;
        },

        // fetch: function(){
            
        // },

        addCoordinate: function(x, y) {
            var newCoord = {x:x, y:y};
            this._listOfCoordinates.push(newCoord);
        },

        setThickness: function(newThickness) {
            if (newThickness >= 0 && newThickness < 100) {
                this._thickness = newThickness;
                return true;
            }

            return false;
        },

        setColour: function(newColour) {
            return this._drawingInformation.setColour(newColour);
        },

        setTool: function(newTool) {
            return this._drawingInformation.setTool(newTool);
        },

        getColour: function(){
            return this._drawingInformation.getColour();
        },

        getTool: function(){
            return this._drawingInformation.getTool();
        },

        getThickness: function(){
            return this._thickness;
        },

        getListOfCoordinates: function(){
            return this._listOfCoordinates;
        }
    });

    return DrawModel;
});