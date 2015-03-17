//
//  RoomCollection.m
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

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

    - (void) fetchRooms {
        [restkitWrapper fetchRooms:self];
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