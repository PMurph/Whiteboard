//
//  RoomCollection.m
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "RoomCollection.h"

@interface RoomCollection ()
@end

@implementation RoomCollection

    - (id) init: (RestkitWrapper *)wrapper {
        restkitWrapper = wrapper;
        [self refreshRoomIds];
    
        return self;
    }

    - (void) refreshRoomIds {
        [restkitWrapper updateRoomIds];
    }

    - (NSArray *) getRoomIds {
        return [restkitWrapper roomIds];
    }
@end