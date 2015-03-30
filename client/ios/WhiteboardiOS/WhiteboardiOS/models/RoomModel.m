#import "RoomModel.h"

@interface RoomModel ()

@end

@implementation RoomModel

    @synthesize roomId;
    @synthesize name;
    @synthesize  type;

    - (id) init:(NSString *)assignedRoomId {
        roomId = assignedRoomId;
        name = @"";
        return self;
    }

@end
