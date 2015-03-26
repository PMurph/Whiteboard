#include "DrawLogic.h"

@interface DrawLogic () {
        BOOL drawing;
        DrawModel *currDrawModel;
    }

@end

@implementation DrawLogic

    + (DrawToolModel *) createDrawToolModel:(NSDictionary *)toolProperties {
        DrawToolModel *newDrawToolModel = nil;
        
        if([toolProperties objectForKey:THICKNESS_KEY] && [toolProperties objectForKey:COLOUR_KEY] && [toolProperties objectForKey:TOOL_TYPE_KEY]) {
            newDrawToolModel = [[DrawToolModel alloc] init];
        
            [newDrawToolModel setThickness:[toolProperties objectForKey:THICKNESS_KEY]];
            [newDrawToolModel setColour:[toolProperties objectForKey:COLOUR_KEY]];
            [newDrawToolModel setTool:[toolProperties objectForKey:TOOL_TYPE_KEY]];
        }
        
        return newDrawToolModel;
    }

    + (DrawModel *) createDrawModel:(DrawToolModel *)drawToolModel {
        DrawModel *newDrawModel = nil;
        
        if(drawToolModel) {
            newDrawModel = [[DrawModel alloc] initWithDrawTool:drawToolModel];
        }
        
        return newDrawModel;
    }

    + (DrawModel *) createDrawModel:(DrawToolModel *)drawToolModel withCoordinates:(NSArray *)coordinates {
        DrawModel *newDrawModel = nil;
        
        if(drawToolModel && coordinates) {
            newDrawModel = [DrawLogic createDrawModel:drawToolModel];
            [newDrawModel setCoordinates:coordinates];
        }
        
        return newDrawModel;
    }

    - (id) init {
        self = [super init];
        
        if(self) {
            drawing = NO;
        }
        
        return self;
    }

    - (void) startDrawing:(DrawToolModel *)drawModel atPoint:(CGPoint)startPoint {
        if(!drawing) {
            currDrawModel = [DrawLogic createDrawModel:drawModel];
            [currDrawModel addCoordinateX:@(startPoint.x) Y:@(startPoint.y)];
            drawing = YES;
        }
    }

    - (void) updateDrawing:(CGPoint)newPoint {
        if(drawing) {
            [currDrawModel addCoordinateX:@(newPoint.x) Y:@(newPoint.y)];
        }
    }

    - (DrawModel *) endDrawing:(CGPoint)finalPoint {
        DrawModel *finalModel = nil;
        if (drawing) {
            [currDrawModel addCoordinateX:@(finalPoint.x) Y:@(finalPoint.y)];
            finalModel = currDrawModel;
            currDrawModel = nil;
        }
        return finalModel;
    }
@end