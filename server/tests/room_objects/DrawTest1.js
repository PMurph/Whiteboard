"use strict";
//{ "vertices": [{"x": 0.0, "y": 1.0}, ...], "tool": {...}, ...}
var DrawObjects = require('./../../src/room_objects/DrawObjects');
var DrawModel = require('./../../src/room_objects/DrawModel');

var drawo = new DrawObjects();
var drawm = new DrawModel();

//console.log( drawo.COLOURS);
console.log("Test");
//console.log(drawm.getColour());
console.log(drawo.setCurrentColour("Black"));
console.log(drawo.getCurrentColour());
console.log(drawo.getCurrentTool());