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

    - (void) addRoom:(RoomModel *)roomModel {
        if(![self isRoomOpen:roomModel.roomId]) {
            [roomModels setValue:roomModel forKey:roomModel.roomId];
        }
    }

    - (BOOL) isRoomOpen:(NSString *)roomId {
        if([roomModels objectForKey:roomId]) {
            return YES;
        }
        return NO;
    }

    - (void) closeAllRooms {
        for(NSString* roomId in roomModels) {
            RoomModel *roomModel = [roomModels objectForKey:roomId];
            [roomModel.socket emit:LEAVE_ROOM_EVENT args:@[@{ROOM_ID_KEY: roomModel.roomId}]];
        }
        roomModels = [[NSMutableDictionary alloc] init];
    }
@end