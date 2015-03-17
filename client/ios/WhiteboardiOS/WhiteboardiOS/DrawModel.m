//
//  NSObject+DrawModel.m
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "DrawModel.h"
#import "Coordinates.h"
#import "DrawObject.h"

@interface DrawModel ()

@end

@implementation DrawModel
NSNumber _thickness;
NSMutableArray *listOfCoordinates;
NSNumber *x;
DrawObject *_drawingInformation;

-(id)init
{
    self = [super init];
    
    if (self) {
        _thickness = 1;
        _drawingInformation = [[DrawObject alloc] init];
    }
    
    return self;
}

- (void)addCoordinateX:(NSNumber*)x  Y:(NSNumber*) y {
    NSDictionary *newCord = @{ @"x":x, @"y":y };
    [listOfCoordinates addObject:(newCord)];
}


- (void)setThickness:(NSNumber*)newThickness {
        if (newThickness >= 0 && newThickness < 100) {
            _thickness = newThickness;
        }
    }

- (void)SetColour:(NSNumber*)newColour {
        _drawingInformation.setColour(newColour);
    }

- (void)setTool:(NSNumber*)newTool {
        _drawingInformation.setTool(newTool);
    }

- (NSString*)getColour: {
        return _drawingInformation.getColour();
    }

- (NSString*)getTool: {
        return _drawingInformation.getTool();
    }

- (NSNumber*)getThickness: {
        return _thickness;
	}

- (NSMutableArray*) getListOfCoordinates:{
        return _listOfCoordinates;
    }

@end