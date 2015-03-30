#import "RoomModel.h"

@interface RoomModel ()

@end

@implementation RoomModel

    @synthesize roomId;

    - (id) init:(NSString *)assignedRoomId {
        roomId = assignedRoomId;
        return self;
    }

@end
