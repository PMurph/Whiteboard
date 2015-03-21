#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "RoomViewController.h"
#import "RoomModel.h"

@interface RoomViewControllerTest : XCTestCase
    @property (nonatomic, readwrite) id roomModelMock;
    @property (nonatomic, readwrite) NSString *testRoomId;
    @property (nonatomic, readwrite) NSString *testRoomTitleFormatString;
    @property (nonatomic, readwrite) RoomViewController *testRoomViewController;
@end

@implementation RoomViewControllerTest

- (void)setUp {
    [super setUp];
    self.testRoomId = @"4";
    self.testRoomTitleFormatString = @"Room %@";
    self.roomModelMock = OCMClassMock([RoomModel class]);
    OCMStub([[self roomModelMock] roomId]).andReturn([self testRoomId]);
    
    self.testRoomViewController = [RoomViewController createRoomViewController:[self roomModelMock]];
}

- (void)tearDown {
    [super tearDown];
}

- (void)testCreateNewRoomControllerDoesntReturnNullWhenGivenValidRoom {
    XCTAssertNotNil([RoomViewController createRoomViewController:self.roomModelMock]);
}

- (void)testCreateNewRoomControllerReturnsRoomControllerWithRoomModel {
    XCTAssertEqual([[RoomViewController createRoomViewController:[self roomModelMock]] roomModel], [self roomModelMock]);
}

- (void)testCreateNewRoomControllerCreatesSocketForRoom {
    //XCTAssertNotNil([[self testRoomViewController] socketIO]);
}

@end
