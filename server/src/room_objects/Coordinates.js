"use strict";

var DrawModel = function(x, y) {
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

module.exports.Coordinates = Coordinates;