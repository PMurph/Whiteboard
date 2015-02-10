define(['backbone'], function (Backbone) {
    'use strict';

var Coordinates = Backbone.Model.extend( {
        initialize: function(x, y) {
            this._x = x;
            this._y = y;
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