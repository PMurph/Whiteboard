#ifndef WhiteboardiOS_RoomManager_h
#define WhiteboardiOS_RoomManager_h

#include "RoomModel.h"

#define LEAVE_ROOM_EVENT @"leaveRoom"
#define ROOM_ID_KEY @"roomId"



@interface RoomManager : NSObject
    - (id) init;
    - (void) addRoom:(RoomModel *)roomModel;
    - (BOOL) isRoomOpen:(NSString *)roomId;
    - (void) closeRoom:(NSString *)roomId;
    - (void) closeAllRooms;
@end

#endif
