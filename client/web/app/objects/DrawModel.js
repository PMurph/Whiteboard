"use strict";
//{ "vertices": [{"x": 0.0, "y": 1.0}, ...], "tool": {...}, ...}
var Coordinates = require('./Coordinates');
var DrawObjects = require('./DrawObjects');

var DrawModel = function() {
    this._drawingInformation = new DrawObjects();
    this._listOfCoordinates = [];
    this._thickness = 1;
};

DrawModel.prototype = {
	addCoordinate: function(x, y) {
        var newCoord = new Coordinates(x, y);
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
    },
};

module.exports = DrawModel;