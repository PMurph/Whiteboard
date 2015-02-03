"use strict";
//{ "vertices": [{"x": 0.0, "y": 1.0}, ...], "tool": {...}, ...}
var Coordinates = require('./Coordinates');
var DrawObjects = require('./DrawObjects');

var DrawModel = function() {
    this.drawingInformation = new DrawObjects();
    this.listOfCoordinates = [];
    this.thickness = 1;
};

DrawModel.prototype = {
	addCoordinate: function(x, y) {
        var newCoord = new Coordinates(x, y);
        this.listOfCoordinates.push(newCoord);
    },

    setThickness: function(newThickness) {
        if (newThickness >= 0 && newThickness < 100) {
            this.thickness = newThickness;
            return true;
        }

        return false;
    },

    setColour: function(newColour) {
        return this.drawingInformation.setColour(newColour);
    },

    setTool: function(newTool) {
        return this.drawingInformation.setTool(newTool);
    },

    getColour: function(){
        return this.drawingInformation.getColour();
    },

    getTool: function(){
        return this.drawingInformation.getTool();
    },

    getThickness: function(){
        return this.thickness;
    },

    getListOfCoordinates: function(){
        return this.listOfCoordinates;
    },
};

module.exports = DrawModel;