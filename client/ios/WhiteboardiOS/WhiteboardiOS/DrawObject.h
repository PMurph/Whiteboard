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

    NSDictionary* colourMap = @{
        @"black" : Colours.BLACK,
        @"blue" : Colours.BLUE,
        @"red" : Colours.RED,
        @"yellow" : Colours.YELLOW,
        @"green" : Colours.GREEN,
        @"purple" : Colours.PURPLE,
    }

    NSDictionary* toolMap = @{
        @"draw" : Tools.DRAW,
        @"erase" : Tools.ERASE,
    }

@property (read, nonatomic, copy) Colours myColour;
@property (read, nonatomic, copy) Tools myTool;

-(id)init;
-(void)setColour:(NSString*)newColour;
-(void)setTool:(NSString*)newTool;
@end
