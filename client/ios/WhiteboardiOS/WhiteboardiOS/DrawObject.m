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
