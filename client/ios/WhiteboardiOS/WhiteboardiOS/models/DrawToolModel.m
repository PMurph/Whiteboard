#import "DrawToolModel.h"

@interface DrawToolModel () {
        NSDictionary *colourMap;
        NSDictionary *toolMap;
    }
@end

@implementation DrawToolModel

    -(id)init {
        colourMap = @{
            @"black" : @[@0.0f, @0.0f, @0.0f],
            @"blue" : @[@0.0f, @0.0f, @1.0f],
            @"red" : @[@1.0f, @0.0f, @0.0f],
            @"yellow" : @[@1.0f, @1.0f, @0.0f],
            @"green" : @[@0.0f, @1.0f, @0.0f],
            @"purple" : @[@(102.0f/255.0f), @0.0f, @1.0f],
        };

        toolMap = @{
            @"draw" : [NSNumber numberWithInt:DRAW],
            @"erase" :[NSNumber numberWithInt:ERASE],
        };

        _myColour = [colourMap objectForKey:@"black"];
        _myTool = DRAW;
        [self setThickness:@1];
    
        return self;
    }

    - (void)setColour:(NSString*)newColour {
        newColour = newColour.lowercaseString;
    
        if ([colourMap objectForKey:newColour]) {
            _myColour = [colourMap objectForKey:newColour];
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
