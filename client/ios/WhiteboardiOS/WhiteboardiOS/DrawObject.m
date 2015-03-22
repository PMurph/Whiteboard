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
    @"black" : [NSNumber numberWithInt:Colours.BLACK],
    @"blue" : [NSNumber numberWithInt:Colours.BLUE],
    @"red" : [NSNumber numberWithInt:Colours.RED],
    @"yellow" : [NSNumber numberWithInt:Colours.YELLOW],
    @"green" : [NSNumber numberWithInt:Colours.GREEN],
    @"purple" : [NSNumber numberWithInt:Colours.PURPLE],
};

NSDictionary* toolMap = @{
    @"draw" : [NSNumber numberWithInt:Tools.DRAW],
    @"erase" :[NSNumber numberWithInt:Tools.ERASE],
};

-(id)init
{
    self = [super init];
    
    if (self) {
        myColour = Colours.BLACK;
        myTool = Tools.DRAW;
    }
    
    return self;
}

-(void)setColour:(NSString*)newColour {
    newColour = newColour.lowercaseString;
    
    if ([colourMap objectForKey:newColour]) {
        myColour = colourMap[newColour];
    }
}

-(void)setTool:(NSString*)newTool {
    newTool = newTool.lowercaseString;
    
    if ([toolMap objectForKey:newTool]) {
        myTool = toolMap[newTool];
    }
}
@end
