//
//  RoomCollectionTest.m
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "RoomCollection.h"

@interface RoomCollectionTest : XCTestCase
    @property (nonatomic, readwrite) id restkitMock;
    @property (nonatomic, readwrite) RoomCollection *collection;
    @property (nonatomic, readwrite) id<RoomCollectionObserver> mockObserver;
    @property (nonatomic, readwrite) NSArray *roomModels;
@end

@implementation RoomCollectionTest

    - (void)setUp {
        [super setUp];
        _roomModels = @[[[RoomModel alloc] init:@"1"], [[RoomModel alloc] init:@"3"]];
        _restkitMock = OCMClassMock([RestkitWrapper class]);
        _mockObserver = OCMProtocolMock(@protocol(RoomCollectionObserver));
        OCMStub([_mockObserver notifyOfChange]);
        
        _collection = [[RoomCollection alloc] init:_restkitMock];
        [_collection registerObserver:_mockObserver];
        
        OCMStub([_restkitMock fetchRooms:_collection]).andDo(^(NSInvocation *invocation) {
            [_collection setCollection:_roomModels];
        });
    }

    - (void)tearDown {
        [super tearDown];
    }

    - (void)testThatObserversAreNotifiedWhenCollectionIsSet {
        [_collection setCollection:_roomModels];
        
        OCMVerify([_mockObserver notifyOfChange]);
    }

    - (void)testThatFetchRoomCallRestKitWrappersFetchRooms {
        [_collection fetchRooms];
        
        OCMVerify([_restkitMock fetchRooms:_collection]);
    }

    - (void)testThatInitiallyNoRoomsExistInCollection {
        XCTAssertEqual([[_collection roomModels] count], 0);
    }

    - (void)testThatRoomsArePopulatedAfterFetch {
        [_collection fetchRooms];
        XCTAssertEqual([[_collection roomModels] count], [_roomModels count]);
    }
@end
