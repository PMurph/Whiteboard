#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "RoomViewController.h"
#import "RoomModel.h"

@interface RoomViewControllerTest : XCTestCase
    @property (nonatomic, readwrite) id roomModelMock;
@end

@implementation RoomViewControllerTest

- (void)setUp {
    [super setUp];
    self.roomModelMock = OCMClassMock([RoomModel class]);
}

- (void)tearDown {
    [super tearDown];
}

- (void) testCreateNewRoomControllerDoesntReturnNullWhenGivenValidRoom {
    XCTAssertNotNil([RoomViewController createRoomViewController:self.roomModelMock]);
}

@end
