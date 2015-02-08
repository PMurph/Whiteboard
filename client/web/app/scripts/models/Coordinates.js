define(['backbone'], function (Backbone) {
    'use strict';

var Coordinates = Backbone.Model.extend( {
        initialize: function(_x, _y) {
            this._x = _x;
            this._y = _y;
        },

        getX: function() {
            return this._x;
        },

        getY: function() {
        	return this._y;
        },

        getXY: function() {
        	return [this._x, this._y];
        }
    });

    return Coordinates;
});