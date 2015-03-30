#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "RoomViewController.h"
#import "RoomModel.h"

@interface RoomViewControllerTest : XCTestCase
    @property (nonatomic, readwrite) id roomModelMock;
    @property (nonatomic, readwrite) id socketMock;
    @property (nonatomic, readwrite) NSString *testRoomId;
    @property (nonatomic, readwrite) NSString *testRoomTitleFormatString;
    @property (nonatomic, readwrite) RoomViewController *testRoomViewController;
@end

@implementation RoomViewControllerTest

- (void)setUp {
    [super setUp];
    self.testRoomId = @"4";
    self.testRoomTitleFormatString = @"Room %@";
    self.socketMock = OCMClassMock([SIOSocket class]);
    self.roomModelMock = OCMClassMock([RoomModel class]);
    OCMStub([[self roomModelMock] roomId]).andReturn([self testRoomId]);
    
    self.testRoomViewController = [RoomViewController createRoomViewController:[self roomModelMock] withSocket:self.socketMock];
}

- (void)tearDown {
    [super tearDown];
}

- (void)testCreateNewRoomControllerDoesntReturnNullWhenGivenValidRoom {
    XCTAssertNotNil([RoomViewController createRoomViewController:self.roomModelMock withSocket:self.socketMock]);
}

- (void)testCreateRoomControllerReturnsRoomControllerWithSocket {
    RoomViewController *testController = [RoomViewController createRoomViewController:self.roomModelMock withSocket:self.socketMock];
    
    XCTAssertEqual(testController.socket, self.socketMock);
}

@end
