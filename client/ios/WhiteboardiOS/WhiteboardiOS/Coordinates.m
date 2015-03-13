//
//  Coordinates.m
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "Coordinates.h"

@implementation Coordinates
int x;
int y;

void setCoordinates( int nx, int ny ) {
    x = nx;
    y = ny;
}

int getX() {
    return x;
}

int getY() {
    return y;
}
@end
