//
//  RestkitWrapper.h
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-14.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#ifndef WhiteboardiOS_RestkitWrapper_h
#define WhiteboardiOS_RestkitWrapper_h

#import <Restkit/RestKit.h>

#import "Collection.h"
#import "RoomModel.h"

@interface RestkitWrapper : NSObject {
        RKObjectManager *objectManager;
        NSString *webAppURI;
    }

    - (id) init: (NSString *)webAppAPIURI;
    - (void) fetchRooms:(id<Collection>)collection;
@end

#endif
