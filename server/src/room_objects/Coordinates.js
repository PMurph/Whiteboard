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
    }
};

module.exports = Coordinates;