#include "DrawLogic.h"

@interface DrawLogic () {
        BOOL drawing;
        DrawModel *currDrawModel;
        CGPoint lastPoint;
    }

    - (CGPoint) getPointFromCoordinate:(NSDictionary *)coord;
    - (void) startFreehandDrawing:(CGPoint)startPoint;
    - (void) newSample:(CGPoint)newPoint;
    - (void) endFreehandDrawing:(CGPoint)endPoint;
    - (void) pasteDrawingToDrawCanvas;
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

    - (void) drawDrawCommand:(DrawModel *)drawCommand {
        NSMutableArray *coordinates = [drawCommand listOfCoordinates];
        NSDictionary *currCoord;
        CGPoint newPoint;
        currDrawModel = drawCommand;
        
        if([coordinates count] > 0) {
            currCoord = [coordinates objectAtIndex:0];
            newPoint = [self getPointFromCoordinate:currCoord];
            
            [self startFreehandDrawing:newPoint];
            for(int i = 1; i < [coordinates count] - 1; i++) {
                currCoord = [coordinates objectAtIndex:i];
                newPoint = [self getPointFromCoordinate:currCoord];
                
                [self newSample:newPoint];
            }
            
            currCoord = [coordinates objectAtIndex:[coordinates count] - 1];
            newPoint = [self getPointFromCoordinate:currCoord];
            [self endFreehandDrawing:newPoint];
        }
    }

    - (CGPoint) getPointFromCoordinate:(NSDictionary *)coord {
        CGPoint point;
        
        point.x = ((NSNumber *)[coord objectForKey:@"x"]).floatValue;
        point.y = ((NSNumber *)[coord objectForKey:@"y"]).floatValue;
        
        return point;
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
        DrawToolModel *drawTool = currDrawModel.drawTool;
    
        UIGraphicsBeginImageContext(self.drawCanvas.frame.size);
        [self.tempDrawCanvas.image drawInRect:CGRectMake(0, 0, self.drawCanvas.frame.size.width, self.drawCanvas.frame.size.height)];
        CGContextMoveToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
        CGContextAddLineToPoint(UIGraphicsGetCurrentContext(), newPoint.x, newPoint.y);
        CGContextSetLineCap(UIGraphicsGetCurrentContext(), kCGLineCapRound);
        CGContextSetLineWidth(UIGraphicsGetCurrentContext(), drawTool.thickness.floatValue);
        CGContextSetRGBStrokeColor(UIGraphicsGetCurrentContext(), [drawTool getRed].floatValue, [drawTool getGreen].floatValue, [drawTool getBlue].floatValue, 1.0);
        CGContextSetBlendMode(UIGraphicsGetCurrentContext(), kCGBlendModeNormal);
    
        CGContextStrokePath(UIGraphicsGetCurrentContext());
        self.tempDrawCanvas.image = UIGraphicsGetImageFromCurrentImageContext();
        [self.tempDrawCanvas setAlpha:1.0];
        UIGraphicsEndImageContext();
        
        lastPoint = newPoint;
    }

    - (DrawModel *) endDrawing:(CGPoint)finalPoint {
        DrawModel *finalModel = nil;
        if (drawing) {
            [currDrawModel addCoordinateX:@(finalPoint.x) Y:@(finalPoint.y)];
            
            [self endFreehandDrawing:finalPoint];
            [self pasteDrawingToDrawCanvas];
            
            finalModel = currDrawModel;
            currDrawModel = nil;
            drawing = NO;
        }
        return finalModel;
    }

    - (void) endFreehandDrawing:(CGPoint)endPoint {
        DrawToolModel *drawTool = currDrawModel.drawTool;
    
        UIGraphicsBeginImageContext(self.drawCanvas.frame.size);
        [self.tempDrawCanvas.image drawInRect:CGRectMake(0, 0, self.drawCanvas.frame.size.width, self.drawCanvas.frame.size.height)];
        CGContextSetLineCap(UIGraphicsGetCurrentContext(), kCGLineCapRound);
        CGContextSetLineWidth(UIGraphicsGetCurrentContext(), drawTool.thickness.floatValue);
        CGContextSetRGBStrokeColor(UIGraphicsGetCurrentContext(), [drawTool getRed].floatValue, [drawTool getGreen].floatValue, [drawTool getBlue].floatValue, 1.0);
        CGContextMoveToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
        CGContextAddLineToPoint(UIGraphicsGetCurrentContext(), endPoint.x, endPoint.y);
        CGContextStrokePath(UIGraphicsGetCurrentContext());
        CGContextFlush(UIGraphicsGetCurrentContext());
        self.tempDrawCanvas.image = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
    }

    - (void) pasteDrawingToDrawCanvas {
        UIGraphicsBeginImageContext(self.drawCanvas.frame.size);
        [self.drawCanvas.image drawInRect:CGRectMake(0, 0, self.drawCanvas.frame.size.width, self.drawCanvas.frame.size.height) blendMode:kCGBlendModeNormal alpha:1.0];
        [self.tempDrawCanvas.image drawInRect:CGRectMake(0, 0, self.drawCanvas.frame.size.width, self.drawCanvas.frame.size.height) blendMode:kCGBlendModeNormal alpha:1.0];
        self.drawCanvas.image = UIGraphicsGetImageFromCurrentImageContext();
        self.tempDrawCanvas.image = nil;
        UIGraphicsEndImageContext();
    }
@end