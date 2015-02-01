"use strict";

var TOOLS = {
	DRAW : { value: 0, name: "Draw"},
	ERASE : { value: 1, name: "Erase" }
};

var COLOURS = {
	BLACK : { value: 0, name: "Black" },
	BLUE : { value: 1, name: "Blue" },
	RED : { value: 2, name: "Red" },
	YELLOW : { value: 3, name: "Yellow" },
	GREEN : { value: 4, name: "Green" },
	PURPLE : { value: 5, name: "Purple" }
};

var DrawObjects = function() {
	this.tool = TOOLS.DRAW;
	this.colour = COLOURS.BLACK;
};

DrawObjects.prototype = {
    TOOLS: function() {
        return TOOLS;
    },

    COLOURS: function() {
        return COLOURS;
    },

    setCurrentColour: function(newColour) {
    	for (var colourName in COLOURS) {
			var colour = COLOURS[colourName];

			if (colour.name === newColour) {
				this.colour = COLOURS[colourName];
				return true;
			}
		}

		return false;
    },

    setCurrentTool: function(newTool) {
    	for (var colourName in TOOLS) {
			var colour = TOOLS[colourName];

			if (colour.name === newTool) {
				this.colour = TOOLS[colourName];
				return true;
			}
		}

		return false;
    },

    getCurrentColour: function() {
    	return this.colour.name;
    },

    getCurrentTool: function() {
    	return this.tool.name;
    }
};

module.exports = DrawObjects;