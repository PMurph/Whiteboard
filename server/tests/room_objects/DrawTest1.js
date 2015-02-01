"use strict";
//{ "vertices": [{"x": 0.0, "y": 1.0}, ...], "tool": {...}, ...}
var DrawObjects = require('./../../src/room_objects/DrawObjects');
var DrawModel = require('./../../src/room_objects/DrawModel');

var drawO = new DrawObjects();
var drawM = new DrawModel();

console.log( drawO.COLOURS);
console.log( drawM.getColour);