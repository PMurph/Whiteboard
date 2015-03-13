//
//  NSObject+DrawModel.m
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "DrawModel.h"
#import "Coordinates.h"

@interface DrawModel ()

@end

@implementation DrawModel
NSMutableArray *listOfCoordinates;

void addCoordinate(int x, int y) {
    NSDictionary *newCord = @{ x, y }
    [listOfCoordinates addObject:(newCord)];
}
@end