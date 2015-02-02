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
	addCoordinate: function(coord) {
		if (coord === Coordinates)
		{
        	this.listOfCoordinates.push(coord);
        }
    },

    getCoordinate: function() {
        return this.listOfCoordinates;
    },

    setThickness: function(newThickness) {
        this.thickness = newThickness;
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