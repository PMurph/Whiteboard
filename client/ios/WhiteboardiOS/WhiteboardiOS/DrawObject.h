//
//  DrawObject.h
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DrawObject : NSObject
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
        PURPLE : { value: 5, name: "Purple" }
    };
    
    var DrawObjects = Backbone.Model.extend({
    url: '/api/drawobject',
        
    initialize: function() {
        this._tool = TOOLS.DRAW;
        this._colour = COLOURS.BLACK;
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
        
    setTool: function(newTool) {
        for (var toolName in TOOLS) {
            var tool = TOOLS[toolName];
            
            if (tool.name === newTool) {
                this._tool = tool;
                return true;
            }
        }
        
        return false;
    },
        
        -(NSString)getColour();
        
-(NSString)getTool();
@end
