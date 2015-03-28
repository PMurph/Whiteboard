#ifndef WhiteboardiOS_RoomManager_h
#define WhiteboardiOS_RoomManager_h

#include "RoomModel.h"

@interface RoomManager : NSObject
    - (id) init;
    - (void) addRoom:(RoomModel *)roomModel;
    - (BOOL) isRoomOpen:(NSString *)roomId;
    - (void) closeAllRooms;
@end

#endif
