#ifndef WhiteboardiOS_DrawModel_h
#define WhiteboardiOS_DrawModel_h

#import "DrawToolModel.h"

@interface DrawModel : NSObject
    @property (readonly, nonatomic, copy) NSMutableArray* listOfCoordinates;
    @property (readonly, nonatomic, copy) DrawToolModel* drawTool;

    - (id)init;
    - (id)initWithDrawTool:(DrawToolModel *)drawToolModel;
    - (void)addCoordinateX:(NSNumber*)x  Y:(NSNumber*) y;
    - (void)setThickness:(NSNumber*)newThickness;
    - (void)setColour:(NSString*)newColour;
    - (void)setTool:(NSString*)newTool;
    - (void)setCoordinates:(NSArray *)coordinates;
@end

#endif