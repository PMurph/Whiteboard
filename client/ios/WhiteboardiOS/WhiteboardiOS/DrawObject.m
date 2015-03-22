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

    _colourMap = [[NSDictionary alloc] init];
    _colourMap = @{
        @"black" : [NSNumber numberWithInt:BLACK],
        @"blue" : [NSNumber numberWithInt:BLUE],
        @"red" : [NSNumber numberWithInt:RED],
        @"yellow" : [NSNumber numberWithInt:YELLOW],
        @"green" : [NSNumber numberWithInt:GREEN],
        @"purple" : [NSNumber numberWithInt:PURPLE],
    };

    _toolMap = [[NSDictionary alloc] init];
    _toolMap = @{
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
    
    if ([_colourMap objectForKey:newColour]) {
        _myColour = [_colourMap objectForKey:newColour];
    }
}

-(void)setTool:(NSString*)newTool {
    newTool = newTool.lowercaseString;
    
    if ([_toolMap objectForKey:newTool]) {
        _myTool = [_toolMap objectForKey:newTool];
    }
}
@end
