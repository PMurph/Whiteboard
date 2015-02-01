"use strict";
//{ "vertices": [{"x": 0.0, "y": 1.0}, ...], "tool": {...}, ...}
var Coordinates = require('./Coordinates');
var DrawObjects = require('./DrawObjects');

var DrawModel = function() {
    var drawObjects = new DrawObjects();

    this.listOfCoordinates = [];
    this.colour = drawObjects.COLOURS.BLACK;
    this.thickness = 1;
    this.tool = drawObjects.TOOLS.DRAW;
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
        this.newColour = newColour;
    },

    setTool: function(newTool) {
        this.tool = newTool;
    },

    getColour: function(){
        return this.colour.name;
    },

    getTool: function(){
        return this.tool;
    },

    getThickness: function(){
        return this.thickness;
    },

    getListOfCoordinates: function(){
        return this.listOfCoordinates;
    },
};

module.exports = DrawModel;