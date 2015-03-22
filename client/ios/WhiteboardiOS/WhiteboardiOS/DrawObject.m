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

    colourMap = [[NSDictionary alloc] init];
    colourMap = @{
        @"black" : [NSNumber numberWithInt:BLACK],
        @"blue" : [NSNumber numberWithInt:BLUE],
        @"red" : [NSNumber numberWithInt:RED],
        @"yellow" : [NSNumber numberWithInt:YELLOW],
        @"green" : [NSNumber numberWithInt:GREEN],
        @"purple" : [NSNumber numberWithInt:PURPLE],
    };

    toolMap = [[NSDictionary alloc] init];
    toolMap = @{
        @"draw" : [NSNumber numberWithInt:DRAW],
        @"erase" :[NSNumber numberWithInt:ERASE],
    };
    
    if (self) {
        _myColour = BLACK;
        _myTool = DRAW;
    }
    
    return self;
}

-(void)setColour:(NSString*)newColour {
    newColour = newColour.lowercaseString;
    
    if ([colourMap objectForKey:newColour]) {
        _myColour = [colourMap objectForKey:newColour];
    }
}

-(void)setTool:(NSString*)newTool {
    newTool = newTool.lowercaseString;
    
    if ([toolMap objectForKey:newTool]) {
        _myTool = [toolMap objectForKey:newTool];
    }
}
@end
