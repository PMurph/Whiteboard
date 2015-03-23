#import <Foundation/Foundation.h>

@interface DrawObject : NSObject
    typedef enum TOOLS : NSUInteger {
        DRAW,
        ERASE
    } Tools;
    
    typedef enum  COLOURS : NSUInteger {
        BLACK,
        BLUE,
        RED,
        YELLOW,
        GREEN,
        PURPLE
    } Colours;

    @property (readonly, nonatomic) Colours myColour;
    @property (readonly, nonatomic) Tools myTool;

    @property (readonly, nonatomic) NSDictionary* colourMap;
    @property (readonly, nonatomic) NSDictionary* toolMap;

    -(id)init;
    -(void)setColour:(NSString*)newColour;
    -(void)setTool:(NSString*)newTool;
@end
