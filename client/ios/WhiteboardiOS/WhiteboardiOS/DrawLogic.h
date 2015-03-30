#ifndef WhiteboardiOS_DrawLogic_h
#define WhiteboardiOS_DrawLogic_h

#import <UIKit/UIKit.h>

#define THICKNESS_KEY @"thickness"
#define COLOUR_KEY @"colour"
#define TOOL_TYPE_KEY @"type"

#include "DrawModel.h"

@interface DrawLogic : NSObject
    @property (nonatomic, weak, readwrite) UIImageView *tempDrawCanvas;
    @property (nonatomic, weak, readwrite) UIImageView *drawCanvas;

    + (DrawToolModel *) createDrawToolModel:(NSDictionary *)toolProperties;
    + (DrawModel *) createDrawModel:(DrawToolModel *)drawToolModel;
    + (DrawModel *) createDrawModel:(DrawToolModel *)drawToolModel withCoordinates:(NSArray *)coordinates;

    - (id) init;
    - (id) initWithDrawCanvas:(UIImageView *)canvas andTempCanvas:(UIImageView *)tempCanvas;
    - (void) drawDrawCommands:(NSArray *)drawCommands;
    - (void) drawDrawCommand:(DrawModel *)drawCommand;
    - (void) startDrawing:(DrawToolModel *)drawModel atPoint:(CGPoint)startPoint;
    - (void) updateDrawing:(CGPoint)newPoint;
    - (DrawModel *) endDrawing:(CGPoint)finalPoint;
@end

#endif
