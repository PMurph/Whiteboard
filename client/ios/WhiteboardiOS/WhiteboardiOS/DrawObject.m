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
@end
