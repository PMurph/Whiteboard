#import "RoomManager.h"

@interface RoomManager () {
        NSMutableDictionary *roomModels;
    }
@end

@implementation RoomManager

    - (id) init {
        roomModels = [[NSMutableDictionary alloc] init];
    
        return self;
    }

    - (RoomViewController *) createRoom:(RoomModel *)roomModel withSocket:(SIOSocket *)socket {
        RoomViewController *newRoom;
        
        if(![self isRoomOpen:roomModel.roomId]) {
            newRoom = [RoomViewController createRoomViewController:roomModel withSocket:socket];
            
            [roomModels setValue:roomModel forKey:roomModel.roomId];
        }
        
        return newRoom;
    }

    - (BOOL) isRoomOpen:(NSString *)roomId {
        if([roomModels objectForKey:roomId]) {
            return YES;
        }
        return NO;
    }
@end