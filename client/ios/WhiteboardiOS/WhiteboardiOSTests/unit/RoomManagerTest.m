#import <XCTest/XCTest.h>

#import "RoomManager.h"

@interface RoomManagerTest : XCTestCase
    @property (nonatomic, readwrite) RoomManager *testRoomManager;
    @property (nonatomic, readwrite) RoomModel *testRoomModel;
    @property (nonatomic, readwrite) id mockSocket;
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

- (void)testCreateRoomShouldNotReturnNilForValidRoomModel {
    XCTAssertNotNil([self.testRoomManager createRoom:self.testRoomModel withSocket:self.mockSocket]);
}

- (void)testCreateRoomShouldReturnNilIfRoomAlreadyExists {
    [self.testRoomManager createRoom:self.testRoomModel withSocket:self.mockSocket];
    XCTAssertNil([self.testRoomManager createRoom:self.testRoomModel withSocket:self.mockSocket]);
}

- (void)testRoomOpenReturnsFalseIfRoomNotCreated {
    XCTAssertFalse([self.testRoomManager isRoomOpen:self.testRoomModel.roomId]);
}

- (void)testRoomOpenReturnsTrueIfRoomIsCreated {
    [self.testRoomManager createRoom:self.testRoomModel withSocket:self.mockSocket];
    XCTAssertTrue([self.testRoomManager isRoomOpen:self.testRoomModel.roomId]);
}

@end
