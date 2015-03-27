#ifndef WhiteboardiOS_DrawToolModel_h
#define WhiteboardiOS_DrawToolModel_h

#import <Foundation/Foundation.h>

#define MAX_THICKNESS 100
#define MIN_THICKNESS 0
#define TOOL_TYPE_KEY @"type"
#define DRAW_TOOL_TYPE @"Draw"
#define VERTICES_KEY @"vertices"
#define COLOUR_KEY @"colour"
#define THICKNESS_KEY @"thickness"

@interface DrawToolModel : NSObject
    typedef enum TOOLS : NSUInteger {
        DRAW,
        ERASE
    } Tools;

    @property (readonly, nonatomic) NSArray *myColour;
    @property (readonly, nonatomic) Tools myTool;
    @property (readonly, nonatomic) NSNumber* thickness;

    - (id) init;
    - (NSNumber *) getRed;
    - (NSNumber *) getGreen;
    - (NSNumber *) getBlue;
    - (void) setColour:(NSString*)newColour;
    - (void) setTool:(NSString*)newTool;
    - (void) setThickness:(NSNumber *)newThickness;
    - (NSDictionary *) toTool;
@end

#endif