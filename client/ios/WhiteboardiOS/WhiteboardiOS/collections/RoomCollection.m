#import "RoomCollection.h"

@interface RoomCollection () {
        RestkitWrapper* restkitWrapper;
        NSMutableArray *observers;
    }
@end

@implementation RoomCollection

    - (id) init: (RestkitWrapper *)wrapper {
        restkitWrapper = wrapper;
        observers = [[NSMutableArray alloc] init];
        _roomModels = [[NSArray alloc] init];
        return self;
    }

    - (void) fetchRooms:(NSString *)authToken cb:(void (^)())cb {
        [restkitWrapper fetchRooms:self withAuthentication:authToken cb:cb];
    }

    - (void) setCollection:(NSArray *)collectionObjects {
        _roomModels = collectionObjects;
        for (id<RoomCollectionObserver> observer in observers) {
            [observer notifyOfChange];
        }
    }

    - (void) registerObserver:(id<RoomCollectionObserver>)observer {
        [observers addObject:observer];
    }
@end