//
//  DrawObject.h
//  WhiteboardiOS
//
//  Created by Chris Funk on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DrawObject : NSObject
    typedef enum TOOLS : NSUInteger {
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

    NSDictionary* colourMap;
    NSDictionary* toolMap;

@property (readonly, nonatomic) Colours myColour;
@property (readonly, nonatomic) Tools myTool;

-(id)init;
-(void)setColour:(NSString*)newColour;
-(void)setTool:(NSString*)newTool;
@end
