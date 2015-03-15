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
@end

@implementation RoomCollectionTest

    - (void)setUp {
        [super setUp];
        RoomModel *model1 = [[RoomModel alloc] init:@"1"];
        RoomModel *model2 = [[RoomModel alloc] init:@"3"];
        NSArray *roomModels = @[model1, model2];
        _restkitMock = OCMClassMock([RestkitWrapper class]);
        OCMStub([_restkitMock updateRoomIds]);
        OCMStub([_restkitMock roomIds]).andReturn(roomModels);
    
        _collection = [[RoomCollection alloc] init:_restkitMock];
    }

    - (void)tearDown {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        [super tearDown];
    }

    - (void)testRefreshRoomIdsCallsRestKitWrapper {
        [_collection refreshRoomIds];
        OCMVerify([_restkitMock updateRoomIds]);
    }

    - (void)testGetRoomIdReturnsTheCorrectRoomIds {
        NSArray *returnedRooms = [_collection getRoomIds];
        RoomModel *testRoom = [returnedRooms objectAtIndex:1];
    
        XCTAssertEqual(testRoom.roomId, @"3");
    }

    - (void)testGetRoomIdDoesNotReturnExtraRooms {
        NSArray * returnedRooms = [_collection getRoomIds];
        
        XCTAssertEqual([returnedRooms count], 2);
    }

@end
