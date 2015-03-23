//
//  NSObject+DrawModel.m
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "DrawModel.h"

@interface DrawModel () {
        NSNumber *maxThickness;
        NSNumber *minThickness;
    }
@end

@implementation DrawModel

    -(id)init
    {
        self = [super init];
        minThickness = [[NSNumber alloc] initWithInt:MIN_THICKNESS];
        maxThickness = [[NSNumber alloc] initWithInt:MAX_THICKNESS];
    
        if (self) {
            _thickness = [[NSNumber alloc] initWithInt:1];
            _drawingInformation = [[DrawObject alloc] init];
        }
    
        return self;
    }

    - (void)addCoordinateX:(NSNumber*)x  Y:(NSNumber*) y {
        NSDictionary *newCord = @{ @"x":x, @"y":y };
        [_listOfCoordinates addObject:(newCord)];
    }


    - (void)setThickness:(NSNumber*)newThickness {
        if (newThickness >= minThickness && newThickness < maxThickness) {
            _thickness = newThickness;
        }
    }

    - (void)setColour:(NSString*)newColour {
        [_drawingInformation setColour:newColour];
    }

    - (void)setTool:(NSString*)newTool {
        [_drawingInformation setTool:newTool];
    }
@end