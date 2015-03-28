#import <XCTest/XCTest.h>

#import "RoomManager.h"

@interface RoomManagerTest : XCTestCase
    @property (nonatomic, readwrite) RoomManager *testRoomManager;
    @property (nonatomic, readwrite) RoomModel *testRoomModel;
@end

@implementation RoomManagerTest

- (void)setUp {
    [super setUp];
    
    self.testRoomManager = [[RoomManager alloc] init];
    self.testRoomModel = [[RoomModel alloc] init];
    
    [self.testRoomModel setRoomId:@"1"];
}

- (void)tearDown {
    [super tearDown];
}

- (void)testRoomOpenReturnsFalseIfRoomNotCreated {
    XCTAssertFalse([self.testRoomManager isRoomOpen:self.testRoomModel.roomId]);
}

- (void)testRoomOpenReturnsTrueIfRoomIsCreated {
    [self.testRoomManager addRoom:self.testRoomModel];
    XCTAssertTrue([self.testRoomManager isRoomOpen:self.testRoomModel.roomId]);
}

@end
