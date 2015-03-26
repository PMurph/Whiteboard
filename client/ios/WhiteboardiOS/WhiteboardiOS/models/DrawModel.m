//
//  NSObject+DrawModel.m
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "DrawModel.h"

@interface DrawModel ()
    - (void)initDrawModel;
@end

@implementation DrawModel

    - (id)init
    {
        [self initDrawModel];
        _drawingInformation = [[DrawObject alloc] init];
    
        return self;
    }

    - (id)initWithDrawInfo:(DrawObject *)drawInfo {
        [self initDrawModel];
        _drawingInformation = drawInfo;
        
        return self;
    }

    - (void)initDrawModel {
        _thickness = [[NSNumber alloc] initWithInt:1];
        _listOfCoordinates = [[NSMutableArray alloc] init];
    }

    - (void)addCoordinateX:(NSNumber*)x  Y:(NSNumber*) y {
        NSDictionary *newCord = @{ @"x":x, @"y":y };
        [_listOfCoordinates addObject:newCord];
    }


    - (void)setThickness:(NSNumber*)newThickness {
        if (newThickness.intValue >= MIN_THICKNESS && newThickness.intValue < MAX_THICKNESS) {
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