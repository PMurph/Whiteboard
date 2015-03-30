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
        self.roomModels = @[[[RoomModel alloc] init:@"1"], [[RoomModel alloc] init:@"3"]];
        self.restkitMock = OCMClassMock([RestkitWrapper class]);
        self.mockObserver = OCMProtocolMock(@protocol(RoomCollectionObserver));
        OCMStub([_mockObserver notifyOfChange]);
        
        self.collection = [[RoomCollection alloc] init:_restkitMock];
        [self.collection registerObserver:self.mockObserver];
        
        OCMStub([_restkitMock fetchRooms:self.collection withAuthentication:@"" cb:nil]).andDo(^(NSInvocation *invocation) {
            [self.collection setCollection:self.roomModels];
        });
    }

    - (void)tearDown {
        [super tearDown];
    }

    - (void)testThatObserversAreNotifiedWhenCollectionIsSet {
        [self.collection setCollection:self.roomModels];
        
        OCMVerify([self.mockObserver notifyOfChange]);
    }

    - (void)testThatFetchRoomCallRestKitWrappersFetchRooms {
        [self.collection fetchRooms:@""];
        
        OCMVerify([self.restkitMock fetchRooms:self.collection withAuthentication:@"" cb:nil]);
    }

    - (void)testThatInitiallyNoRoomsExistInCollection {
        XCTAssertEqual([[self.collection roomModels] count], 0);
    }

    - (void)testThatRoomsArePopulatedAfterFetch {
        [self.collection fetchRooms:@""];
        XCTAssertEqual([[self.collection roomModels] count], [self.roomModels count]);
    }
@end
