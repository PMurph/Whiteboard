"use strict";
//{ "vertices": [{"x": 0.0, "y": 1.0}, ...], "tool": {...}, ...}
var Coordinates = require('./Coordinates');
var DrawObjects = require('./DrawObjects');

var DrawModel = function() {
    var drawObjects = new DrawObjects();

    this.listOfCoordinates = [];
    this.colour = drawObjects.getColour();
    this.thickness = 1;
    this.tool = drawObjects.getTool();
};

DrawModel.prototype = {
	addCoordinate: function(coord) {
		if (coord === Coordinates)
		{
        	this.listOfCoordinates.push(coord);
        }
    },

    setThickness: function(newThickness) {
        this.thickness = newThickness;
    },

    setColour: function(newColour) {
        return this.colour.setColour(newColour);
    },

    setTool: function(newTool) {
        return this.tool.setTool(newTool);
    },

    getColour: function(){
        return this.colour.getColour();
    },

    getTool: function(){
        return this.tool.getTool();
    },

    getThickness: function(){
        return this.thickness;
    },

    getListOfCoordinates: function(){
        return this.listOfCoordinates;
    },
};

module.exports = DrawModel;