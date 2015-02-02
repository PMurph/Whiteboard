"use strict";
//{ "vertices": [{"x": 0.0, "y": 1.0}, ...], "tool": {...}, ...}
var DrawObjects = require('./../../src/room_objects/DrawObjects');
var DrawModel = require('./../../src/room_objects/DrawModel');

var drawo = new DrawObjects();
var drawm = new DrawModel();

console.log("Object Test");
console.log(drawo.setColour("Black"));
console.log(drawo.getColour());
console.log(drawo.getTool());

console.log(drawo.setColour("aslfkjdasklfjasdklfjasdklfjsd"));
console.log(drawo.getColour());

console.log(drawo.setColour("Blue"));
console.log(drawo.getColour());

console.log("\nModel Test");
console.log(drawm.getColour());
console.log(drawm.getTool());
console.log(drawm.getThickness());
console.log(drawm.getListOfCoordinates());

console.log(drawm.setColour("Black"));
console.log(drawm.getColour());

console.log("\Coordinate Test");
drawm.addCoordinate(0, 0);
drawm.addCoordinate(1, 1);
drawm.addCoordinate(2, 2);
drawm.addCoordinate(-3, -3);
console.log(drawm.getListOfCoordinates());