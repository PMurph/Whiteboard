"use strict";

var Coordinates = function(_x, _y) {
    this._x = _x;
    this._y = _y;
};

Coordinates.prototype = {
    getX: function() {
        return this._x;
    },

    getY: function() {
    	return this._y;
    },

    getXY: function() {
    	return [this._x, this._y];
    }
};

module.exports = Coordinates;