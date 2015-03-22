//
//  DrawObject.m
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "DrawObject.h"

@implementation DrawObject
-(id)init
{
    self = [super init];
    
    if (self) {
        myColour = BLACK;
        myTool = DRAW;
    }
    
    return self;
}

-(void)setColour:(NSString*)newColour {
    newColour = newColour.lowercaseString;
    
    if ([newColour  isEqual: @"black"]) {
        myColour = BLACK;
    }
    else if ([newColour  isEqual: @"blue"]) {
        myColour = BLUE;
    }
    else if ([newColour  isEqual: @"red"]) {
        myColour = RED;
    }
    else if ([newColour  isEqual: @"yellow"]) {
        myColour = YELLOW;
    }
    else if ([newColour  isEqual: @"green"]) {
        myColour = GREEN;
    }
    else if ([newColour  isEqual: @"purple"]) {
        myColour = PURPLE;
    }
}

-(void)setTool:(NSString*)newTool {
    newTool = newTool.lowercaseString;
    
    if ([newTool  isEqual: @"draw"]) {
        myTool = DRAW;
    }
    else if ([newTool  isEqual: @"erase"]) {
        myTool = ERASE;
    }
}

-(NSString*)getColour {
    NSString* colourType;
    
    switch (myColour) {
        case BLACK:
            colourType = @"Black";
            break;
            
        case BLUE:
            colourType = @"Blue";
            break;
            
        case RED:
            colourType = @"Red";
            break;
            
        case YELLOW:
            colourType = @"Yellow";
            break;
            
        case GREEN:
            colourType = @"Green";
            break;
            
        case PURPLE:
            colourType = @"Purple";
            break;
            
        default:
            colourType = @"Undefined Colour";
            break;
    }
    
    return colourType;
}

-(NSString*)getTool {
    NSString* toolType;
    
    switch (myTool) {
        case DRAW:
            toolType = @"Draw";
            break;
            
        case ERASE:
            toolType = @"Erase";
            break;
            
        default:
            toolType = @"Undefined Tool";
            break;
    }
    
    return toolType;
}
@end
