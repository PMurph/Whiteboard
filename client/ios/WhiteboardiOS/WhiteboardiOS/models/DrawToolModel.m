#import "DrawToolModel.h"

@interface DrawToolModel () {
        NSDictionary *colourMap;
        NSDictionary *toolMap;
    }
@end

@implementation DrawToolModel

    -(id)init {
        colourMap = @{
            @"black" : [NSNumber numberWithInt:BLACK],
            @"blue" : [NSNumber numberWithInt:BLUE],
            @"red" : [NSNumber numberWithInt:RED],
            @"yellow" : [NSNumber numberWithInt:YELLOW],
            @"green" : [NSNumber numberWithInt:GREEN],
            @"purple" : [NSNumber numberWithInt:PURPLE],
        };

        toolMap = @{
            @"draw" : [NSNumber numberWithInt:DRAW],
            @"erase" :[NSNumber numberWithInt:ERASE],
        };

        _myColour = BLACK;
        _myTool = DRAW;
        [self setThickness:@1];
    
        return self;
    }

    - (void)setColour:(NSString*)newColour {
        newColour = newColour.lowercaseString;
    
        if ([colourMap objectForKey:newColour]) {
            _myColour = [[colourMap objectForKey:newColour] unsignedIntegerValue];
        }
    }

    - (void)setTool:(NSString*)newTool {
        newTool = newTool.lowercaseString;
    
        if ([toolMap objectForKey:newTool]) {
            _myTool = [[toolMap objectForKey:newTool] unsignedIntegerValue];
        }
    }

    - (void) setThickness:(NSNumber *)newThickness {
        if (newThickness.intValue >= MIN_THICKNESS && newThickness.intValue < MAX_THICKNESS) {
            _thickness = newThickness;
        }
    }
    
@end
