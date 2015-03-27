#include "DrawLogic.h"

@interface DrawLogic () {
        BOOL drawing;
        DrawModel *currDrawModel;
        CGPoint lastPoint;
    }

    - (void) startFreehandDrawing:(CGPoint)startPoint;
    - (void) newSample:(CGPoint)newPoint;
    - (void) endFreehandDrawing:(CGPoint)endPoint;
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

    - (id) initWithDrawCanvas:(UIImageView *)canvas andTempCanvas:(UIImageView *)tempCanvas {
        self = [self init];
        
        if(self) {
            [self setDrawCanvas:canvas];
            [self setTempDrawCanvas:tempCanvas];
        }
        
        return self;
    }

    - (void) startDrawing:(DrawToolModel *)drawModel atPoint:(CGPoint)startPoint {
        if(!drawing) {
            currDrawModel = [DrawLogic createDrawModel:drawModel];
            [currDrawModel addCoordinateX:@(startPoint.x) Y:@(startPoint.y)];
            drawing = YES;
            [self startFreehandDrawing:startPoint];
        }
    }

    - (void) startFreehandDrawing:(CGPoint)startPoint {
        lastPoint = startPoint;
    }

    - (void) updateDrawing:(CGPoint)newPoint {
        if(drawing) {
            [currDrawModel addCoordinateX:@(newPoint.x) Y:@(newPoint.y)];
            [self newSample:newPoint];
            
        }
    }

    - (void) newSample:(CGPoint)newPoint {
        UIGraphicsBeginImageContext(self.drawCanvas.frame.size);
        [self.tempDrawCanvas.image drawInRect:CGRectMake(0, 0, self.drawCanvas.frame.size.width, self.drawCanvas.frame.size.height)];
        CGContextMoveToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
        CGContextAddLineToPoint(UIGraphicsGetCurrentContext(), newPoint.x, newPoint.y);
        CGContextSetLineCap(UIGraphicsGetCurrentContext(), kCGLineCapRound);
        CGContextSetLineWidth(UIGraphicsGetCurrentContext(), currDrawModel.drawTool.thickness.intValue);
        CGContextSetRGBStrokeColor(UIGraphicsGetCurrentContext(), 0.0, 0.0, 0.0, 1.0);
        CGContextSetBlendMode(UIGraphicsGetCurrentContext(), kCGBlendModeNormal);
    
        CGContextStrokePath(UIGraphicsGetCurrentContext());
        self.tempDrawCanvas.image = UIGraphicsGetImageFromCurrentImageContext();
        [self.tempDrawCanvas setAlpha:1.0];
        UIGraphicsEndImageContext();
    }

    - (DrawModel *) endDrawing:(CGPoint)finalPoint {
        DrawModel *finalModel = nil;
        if (drawing) {
            [currDrawModel addCoordinateX:@(finalPoint.x) Y:@(finalPoint.y)];
            finalModel = currDrawModel;
            currDrawModel = nil;
            [self endFreehandDrawing:finalPoint];
        }
        return finalModel;
    }

    - (void) endFreehandDrawing:(CGPoint)endPoint {
    }
@end