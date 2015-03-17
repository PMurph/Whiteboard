//
//  DashboardControllerTest.m
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-17.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "DashboardViewController.h"

@interface DashboardControllerTest : XCTestCase
    @property (nonatomic, readwrite) id roomCollectionMock;
    @property (nonatomic, readwrite) NSArray *testRoomModels;
    @property (nonatomic, readwrite) DashboardViewController *testDashboardViewController;
@end

@implementation DashboardControllerTest

- (void)setUp {
    [super setUp];
    self.testRoomModels = @[[[RoomModel alloc] init:@"1"], [[RoomModel alloc] init:@"3"]];
    self.roomCollectionMock = OCMClassMock([RoomCollection class]);
    OCMStub([self.roomCollectionMock fetchRooms]);
    OCMStub([self.roomCollectionMock roomModels]).andReturn(self.testRoomModels);
    
    self.testDashboardViewController = [DashboardViewController alloc];
    self.testDashboardViewController.roomCollection = self.roomCollectionMock;
}

- (void)tearDown {
    [super tearDown];
}

- (void)testViewDidAppearCallsFetchRooms {
    [self.testDashboardViewController viewDidAppear:YES];
    
    OCMVerify([self.roomCollectionMock fetchRooms]);
}

- (void)testNotifyOfChangeGetsRoomModelsFromRoomCollection {
    [self.testDashboardViewController notifyOfChange];
    
    OCMVerify([self.roomCollectionMock roomModels]);
}

- (void)testNumberOfItemsInSectionReturnsZeroWhenNoRooms {
    XCTAssertEqual([self.testDashboardViewController collectionView:self.testDashboardViewController.roomCollectionView numberOfItemsInSection:0], 0);
}

- (void)testNumberOfItemsInSectionReturnsAllRoomModelsIfLessThanMaxPerSectionExist {
    [self.testDashboardViewController notifyOfChange];
    
    XCTAssertEqual([self.testDashboardViewController collectionView:self.testDashboardViewController.roomCollectionView numberOfItemsInSection:0], 2);
}

- (void)testNumberOfSectionsInCollectionViewReturnsZeroWhenNoRooms {
    XCTAssertEqual([self.testDashboardViewController numberOfSectionsInCollectionView:self.testDashboardViewController.roomCollectionView], 0);
}

- (void)testNumberOfSectionsInCollectionViewReturnsOneIfLessThanOneSectionsWorthOfRoomsExist {
    [self.testDashboardViewController notifyOfChange];
    
    XCTAssertEqual([self.testDashboardViewController numberOfSectionsInCollectionView:self.testDashboardViewController.roomCollectionView], 1);
}

@end
