#import "RoomManager.h"
#import "RoomViewController.h"

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

    - (void) closeRoom:(NSString *)roomId {
        if ([self isRoomOpen:roomId]) {
            RoomModel *roomModel = [roomModels objectForKey:roomId];
            RoomViewController* roomView = (RoomViewController*)roomModel.roomView;
            [roomModel.socket emit:LEAVE_ROOM_EVENT args:@[@{ROOM_ID_KEY: roomId}]];
            [roomModel.socket close];
            [roomView removeControllerTab];
            
            [roomModels removeObjectForKey:roomId];
        }
    }

    - (void) closeAllRooms {
        for(NSString* roomId in roomModels) {
            [self closeRoom:roomId];
        }
        roomModels = [[NSMutableDictionary alloc] init];
    }
@end