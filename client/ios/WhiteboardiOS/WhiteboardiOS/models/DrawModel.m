#import "DrawModel.h"

@interface DrawModel ()
    - (void)initDrawModel;
@end

@implementation DrawModel

    - (id) init
    {
        [self initDrawModel];
        _drawTool = [[DrawToolModel alloc] init];
    
        return self;
    }

    - (id) initWithDrawTool:(DrawToolModel *)drawToolModel {
        [self initDrawModel];
        _drawTool = drawToolModel;
        
        return self;
    }

    - (void) initDrawModel {
        _listOfCoordinates = [[NSMutableArray alloc] init];
    }

    - (void) addCoordinateX:(NSNumber*)x  Y:(NSNumber*) y {
        NSDictionary *newCord = @{ @"x":x, @"y":y };
        [_listOfCoordinates addObject:newCord];
    }


    - (void) setThickness:(NSNumber*)newThickness {
        [_drawTool setThickness:newThickness];
    }

    - (void) setColour:(NSString*)newColour {
        [_drawTool setColour:newColour];
    }

    - (void) setTool:(NSString*)newTool {
        [_drawTool setTool:newTool];
    }

    - (void) setCoordinates:(NSArray *)coordinates {
        _listOfCoordinates = [[NSMutableArray alloc] initWithArray:coordinates];
    }
@end