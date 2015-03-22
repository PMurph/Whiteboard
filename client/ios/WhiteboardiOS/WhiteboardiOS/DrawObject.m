//
//  DrawObject.m
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "DrawObject.h"

@implementation DrawObject

NSDictionary* colourMap = @{
    @"black" : [NSNumber numberWithInt:BLACK],
    @"blue" : [NSNumber numberWithInt:BLUE],
    @"red" : [NSNumber numberWithInt:RED],
    @"yellow" : [NSNumber numberWithInt:YELLOW],
    @"green" : [NSNumber numberWithInt:GREEN],
    @"purple" : [NSNumber numberWithInt:PURPLE],
};

NSDictionary* toolMap = @{
    @"draw" : [NSNumber numberWithInt:DRAW],
    @"erase" :[NSNumber numberWithInt:ERASE],
};

-(id)init
{
    self = [super init];
    
    if (self) {
        _myColour = Colours.BLACK;
        _myTool = Tools.DRAW;
    }
    
    return self;
}

-(void)setColour:(NSString*)newColour {
    newColour = newColour.lowercaseString;
    
    if ([colourMap objectForKey:newColour]) {
        _myColour = colourMap[newColour];
    }
}

-(void)setTool:(NSString*)newTool {
    newTool = newTool.lowercaseString;
    
    if ([toolMap objectForKey:newTool]) {
        _myTool = toolMap[newTool];
    }
}
@end
