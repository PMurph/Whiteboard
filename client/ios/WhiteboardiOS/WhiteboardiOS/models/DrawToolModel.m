#import "DrawToolModel.h"

@interface DrawToolModel () {
        NSDictionary *colourMap;
        NSDictionary *toolMap;
        NSString *colourName;
        NSString *toolName;
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
            @"erase": [NSNumber numberWithInt:ERASE],
        };

        toolName = @"draw";
        colourName = @"black";
        _myColour = [colourMap objectForKey:colourName];
        _myTool = DRAW;
        [self setThickness:@10];
    
        return self;
    }

    - (NSNumber *) getRed {
        return [_myColour objectAtIndex:0];
    }

    - (NSNumber *) getGreen {
        return [_myColour objectAtIndex:1];
    }

    - (NSNumber *) getBlue {
        return [_myColour objectAtIndex:2];
    }

    - (void) setColour:(NSString*)newColour {
        newColour = newColour.lowercaseString;
    
        if ([colourMap objectForKey:newColour]) {
            colourName = newColour;
            _myColour = [colourMap objectForKey:newColour];
        }
    }

    - (void) setTool:(NSString*)newTool {
        newTool = newTool.lowercaseString;
    
        if ([toolMap objectForKey:newTool]) {
            toolName = newTool;
            _myTool = [[toolMap objectForKey:newTool] unsignedIntegerValue];
        }
    }

    - (void) setThickness:(NSNumber *)newThickness {
        if (newThickness.intValue >= MIN_THICKNESS && newThickness.intValue < MAX_THICKNESS) {
            _thickness = newThickness;
        }
    }

    - (NSDictionary *) toTool {
        NSMutableDictionary *tool = [[NSMutableDictionary alloc] init];
        
        [tool setObject:_thickness forKey:THICKNESS_KEY];
        [tool setObject:colourName forKey:COLOUR_KEY];
        [tool setObject:toolName forKey:TOOL_TYPE_KEY];
        
        return tool;
    }
    
@end
