#ifndef WhiteboardiOS_RoomCollection_h
#define WhiteboardiOS_RoomCollection_h

#import <RestKit/RestKit.h>

#import "Collection.h"
#import "RestkitWrapper.h"
#import "RoomCollectionObserver.h"

@interface RoomCollection : NSObject <Collection>

    @property (nonatomic, readonly) NSArray *roomModels;

    - (id) init: (RestkitWrapper *)wrapper;
    - (void) fetchRooms;
    - (void) setCollection:(NSArray *)collectionObjects;
    - (void) registerObserver:(id <RoomCollectionObserver>)observer;
@end

#endif
