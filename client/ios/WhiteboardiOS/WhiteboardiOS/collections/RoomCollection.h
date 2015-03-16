//
//  RoomCollection.h
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#ifndef WhiteboardiOS_RoomCollection_h
#define WhiteboardiOS_RoomCollection_h

#import <RestKit/RestKit.h>
#import "RestkitWrapper.h"

@interface RoomCollection : NSObject {
        RestkitWrapper* restkitWrapper;
    }

    - (id) init: (RestkitWrapper *)wrapper;
    - (void) refreshRoomIds;
    - (NSArray *) getRoomIds;
@end

#endif