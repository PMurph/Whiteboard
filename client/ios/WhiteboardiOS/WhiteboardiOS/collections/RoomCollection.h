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
#import"RoomModel.h"

@interface RoomCollection : NSObject {
        RKObjectManager* objectManager;
    }

    - (id) init;
    - (void) configureRestKit;
    - (void) getRoomIds;
@end

#endif
