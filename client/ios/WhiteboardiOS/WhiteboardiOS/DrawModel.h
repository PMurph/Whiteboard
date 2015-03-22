//
//  NSObject+DrawModel.h
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DrawModel : NSObject
@property (read, nonatomic, copy) NSNumber _thickness;
@property (read, nonatomic, copy) NSMutableArray *listOfCoordinates;
@property (read, nonatomic, copy) NSNumber *x;
@property (read, nonatomic, copy) DrawObject *_drawingInformation;

- (id)init;
- (void)addCoordinateX:(NSNumber*)x  Y:(NSNumber*) y;
- (void)setThickness:(NSNumber*)newThickness;
- (void)SetColour:(NSNumber*)newColour;
- (void)setTool:(NSNumber*)newTool;
@end
