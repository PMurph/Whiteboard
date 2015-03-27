#ifndef WhiteboardiOS_RoomManager_h
#define WhiteboardiOS_RoomManager_h

#include "RoomModel.h"
#include "RoomViewController.h"

@interface RoomManager : NSObject
    - (id) init;
    - (RoomViewController *) createRoom:(RoomModel *)roomModel withSocket:(SIOSocket *)socket;
    - (BOOL) isRoomOpen:(NSString *)roomId;
@end

#endif
