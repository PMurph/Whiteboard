#import "RoomModel.h"

@implementation RoomModel
    @synthesize roomId;

    - (id) init:(NSString *)assignedRoomId {
        roomId = assignedRoomId;
        return self;
    }
@end
