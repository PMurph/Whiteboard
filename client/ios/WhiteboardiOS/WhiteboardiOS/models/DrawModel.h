//
//  NSObject+DrawModel.h
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "DrawObject.h"

@interface DrawModel : NSObject
    @property (readonly, nonatomic, copy) NSNumber* thickness;
    @property (readonly, nonatomic, copy) NSMutableArray* listOfCoordinates;
    @property (readonly, nonatomic, copy) DrawObject* drawingInformation;

    - (id)init;
    - (void)addCoordinateX:(NSNumber*)x  Y:(NSNumber*) y;
    - (void)setThickness:(NSNumber*)newThickness;
    - (void)SetColour:(NSNumber*)newColour;
    - (void)setTool:(NSNumber*)newTool;
@end
