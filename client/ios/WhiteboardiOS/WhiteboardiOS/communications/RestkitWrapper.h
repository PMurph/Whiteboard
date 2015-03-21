#ifndef WhiteboardiOS_RestkitWrapper_h
#define WhiteboardiOS_RestkitWrapper_h

#import <Restkit/RestKit.h>

#import "Collection.h"
#import "RoomModel.h"
#import "UserModel.h"

@interface RestkitWrapper : NSObject {
        RKObjectManager *objectManager;
        NSString *webAppURI;
    }

    - (id) init: (NSString *)webAppAPIURI;
    - (void) fetchRooms:(id<Collection>)collection;
    - (void) fetchUser;
@end

#endif
