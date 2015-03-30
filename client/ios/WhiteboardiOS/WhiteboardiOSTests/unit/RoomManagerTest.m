#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "RoomManager.h"

@interface RoomManagerTest : XCTestCase
    @property (nonatomic, readwrite) RoomManager *testRoomManager;
    @property (nonatomic, readwrite) RoomModel *testRoomModel;
    @property (nonatomic, readwrite) id socketMock;
@end

@implementation RoomManagerTest

- (void)setUp {
    [super setUp];
    
    self.socketMock = OCMClassMock([SIOSocket class]);
    OCMStub([self.socketMock emit:[OCMArg any] args:[OCMArg any]]);
    OCMStub([self.socketMock close]);
    
    self.testRoomManager = [[RoomManager alloc] init];
    
    self.testRoomModel = [[RoomModel alloc] init];
    [self.testRoomModel setSocket:self.socketMock];
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

- (void)testCloseAllRoomsEmitMessage {
    [self.testRoomManager addRoom:self.testRoomModel];
    [self.testRoomManager closeAllRooms];
    OCMVerifyAll(self.socketMock);
}

- (void)testCloseRoomEmitMessage {
    [self.testRoomManager addRoom:self.testRoomModel];
    [self.testRoomManager closeRoom:self.testRoomModel.roomId];
    OCMVerifyAll(self.socketMock);
}

@end
