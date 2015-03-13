//
//  DrawObject.h
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DrawObject : NSObject

    typedef enum TOOLS : NSString {
        DRAW,
        ERASE
    } Tools;
    
    typedef enum  COLOURS : NSUInteger {
        BLACK,
        BLUE,
        RED,
        YELLOW,
        GREEN,
        PURPLE
    } Colours;

-(id)init;
-(void)setColour:(NSString*)newColour;
-(void)setTool:(NSString*)newTool;
-(NSString*)getColour;
-(NSString*)getTool;
@end
