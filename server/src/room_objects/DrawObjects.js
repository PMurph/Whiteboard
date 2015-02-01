"use strict";

var TOOLS = {
	DRAW : { value: 0, name: "Draw"},
	ERASE : { value: 1, name: "Erase" }
};

var COLOURS = {
	BLACK : { value: 0, name: "Black" },
	BLUE : { value: 1, name: "Blue" }
};

var DrawObjects = function() {
	this.tools = TOOLS;
	this.colour = COLOURS;
};

DrawObjects.prototype = {
    TOOLS: function() {
        return TOOLS;
    },

    COLOURS: function() {
        return COLOURS;
    },
};

module.exports.DrawObjects = DrawObjects;