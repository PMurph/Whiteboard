define(['backbone'], function (Backbone) {
    'use strict';

    var TOOLS = {
        DRAW : { value: 0, name: "Draw"},
        ERASE : { value: 1, name: "Erase" }
    };

    var COLOURS = {
        BLACK : { value: 0, name: "Black" },
        BLUE : { value: 1, name: "Blue" },
        RED : { value: 2, name: "Red" },
        YELLOW : { value: 3, name: "Yellow" },
        GREEN : { value: 4, name: "Green" },
        PURPLE : { value: 5, name: "Purple" },
        WHITE : { value: 6, name: "White" }
    };

    var MIN_THICKNESS = 0,
        MAX_THICKNESS = 100;

    var DrawTools = Backbone.Model.extend({
        initialize: function() {
            this._tool = TOOLS.DRAW;
            this._colour = COLOURS.BLACK;
            this._thickness = 10;
        },

        setColour: function(newColour) {
            for (var colourName in COLOURS) {
                var colour = COLOURS[colourName];

                if (colour.name === newColour) {
                    this._colour = colour;
                    return true;
                }
            }

            return false;
        },

        setToolType: function(newTool) {
            for (var toolName in TOOLS) {
                var tool = TOOLS[toolName];

                if (tool.name === newTool) {
                    this._tool = tool;

                    if (newTool === TOOLS.ERASE.name) {
                        this.setColour(COLOURS.WHITE.name);
                    }
                    return true;
                }
            }

            return false;
        },

        setThickness: function(newThickness) {
            if (newThickness >= MIN_THICKNESS && newThickness < MAX_THICKNESS) {
                this._thickness = newThickness;
                return true;
            }

            return false;
        },

        getColour: function() {
            return this._colour.name;
        },

        getToolType: function() {
            return this._tool.name;
        },

        getThickness: function() {
            return this._thickness;
        }

    });

    return DrawTools;
});
