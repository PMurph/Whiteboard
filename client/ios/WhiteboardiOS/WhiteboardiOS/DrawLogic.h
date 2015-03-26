#ifndef WhiteboardiOS_DrawLogic_h
#define WhiteboardiOS_DrawLogic_h

#import <UIKit/UIKit.h>

#define THICKNESS_KEY @"thickness"
#define COLOUR_KEY @"colour"
#define TOOL_TYPE_KEY @"type"

#include "DrawModel.h"

@interface DrawLogic : NSObject
    + (DrawToolModel *) createDrawToolModel:(NSDictionary *)toolProperties;
    + (DrawModel *) createDrawModel:(DrawToolModel *)drawToolModel;
    + (DrawModel *) createDrawModel:(DrawToolModel *)drawToolModel withCoordinates:(NSArray *)coordinates;

    - (id) init;
    - (void) startDrawing:(DrawToolModel *)drawModel atPoint:(CGPoint)startPoint;
    - (void) updateDrawing:(CGPoint)newPoint;
    - (DrawModel *) endDrawing:(CGPoint)finalPoint;
@end

#endif
