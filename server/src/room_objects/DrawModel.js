"use strict";
//{ "vertices": [{"x": 0.0, "y": 1.0}, ...], "tool": {...}, ...}
var Coordinates = require('coordinates');

var TOOLS = {
	DRAW : { value: 0, name: "Draw", code: "D" },
	ERASE : { value: 1, name: "Erase", code: "E" },
};

var COLOURS = {
	BLACK : { value: 0, name: "Black", code: "Bk" },
	BLUE : { value: 1, name: "Blue", code: "Bl" },
};

var DrawModel = function() {
    this.listOfCoordinates = [];
    this.colour = COLOUR.BLACK;
    this.thickness = 1;
    this.tool = TOOLS.DRAW;
};

DrawModel.prototype = {
	addCoordinate: function(coord) {
		if (typeof coord === "coordinate")
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
    }
};

module.exports.DrawModel = DrawModel;