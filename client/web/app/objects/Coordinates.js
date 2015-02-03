"use strict";

var Coordinates = function(x, y) {
    this.x = x;
    this.y = y;
};

Coordinates.prototype = {
    getX: function() {
        return this.x;
    },

    getY: function() {
    	return this.y;
    },

    getXY: function() {
    	return [this.x, this.y];
    }
};

module.exports = Coordinates;