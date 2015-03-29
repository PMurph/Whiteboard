#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "RoomViewController.h"
#import "RoomModel.h"

@interface RoomViewControllerTest : XCTestCase
    @property (nonatomic, readwrite) id roomModelMock;
    @property (nonatomic, readwrite) id socketMock;
    @property (nonatomic, readwrite) id drawLogicMock;
    @property (nonatomic, readwrite) id uiTouchMock;
    @property (nonatomic, readwrite) id drawToolMock;
    @property (nonatomic, readwrite) id drawModelMock;
    @property (nonatomic, readwrite) CGPoint testPoint;
    @property (nonatomic, readwrite) NSString *testRoomId;
    @property (nonatomic, readwrite) NSString *testRoomTitleFormatString;
    @property (nonatomic, readwrite) NSSet *testTouchSet;
    @property (nonatomic, readwrite) RoomViewController *testRoomViewController;
@end

@implementation RoomViewControllerTest

- (void)setUp {
    [super setUp];
    CGPoint testPoint;
    testPoint.x = 5;
    testPoint.y = -4;
    self.testPoint = testPoint;
    
    self.testRoomId = @"4";
    self.testRoomTitleFormatString = @"Room %@";
    
    self.socketMock = OCMClassMock([SIOSocket class]);
    self.drawToolMock = OCMClassMock([DrawToolModel class]);
    
    self.roomModelMock = OCMClassMock([RoomModel class]);
    OCMStub([[self roomModelMock] roomId]).andReturn([self testRoomId]);
    
    self.drawModelMock = OCMClassMock([DrawModel class]);
    OCMStub([self.drawModelMock toDrawMessage:[OCMArg any]]).andReturn(@[]);
    
    self.drawLogicMock = OCMClassMock([DrawLogic class]);
    OCMStub([[[self.drawLogicMock stub] ignoringNonObjectArgs] startDrawing:self.drawToolMock atPoint:self.testPoint]);
    OCMStub([[[self.drawLogicMock stub] ignoringNonObjectArgs] updateDrawing:self.testPoint]);
    OCMStub([[[self.drawLogicMock stub] ignoringNonObjectArgs] endDrawing:self.testPoint]).andReturn(self.drawModelMock);
    
    self.uiTouchMock = OCMClassMock([UITouch class]);
    OCMStub([self.uiTouchMock locationInView:[OCMArg any]]).andReturn(self.testPoint);
    
    self.testTouchSet = [[NSSet alloc] initWithObjects:self.uiTouchMock, nil];
    
    self.testRoomViewController = [RoomViewController createRoomViewController:[self roomModelMock] withSocket:self.socketMock];
    [self.testRoomViewController setDrawToolModel:self.drawToolMock];
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

- (void)testTouchesBeganCallsUITouchLocationInView {
    [self.testRoomViewController touchesBegan:self.testTouchSet withEvent:nil];
    
    OCMVerify([self.uiTouchMock locationInView:[OCMArg any]]);
}

- (void)testTouchesBeganCallsDrawLogicStartDrawing {
    [self.testRoomViewController touchesBegan:self.testTouchSet withEvent:nil];
    
    OCMVerify([[[self.drawLogicMock stub] ignoringNonObjectArgs] startDrawing:self.drawToolMock atPoint:self.testPoint]);
}

- (void)testTouchesMovedCallsUITouchLocationInView {
    [self.testRoomViewController touchesMoved:self.testTouchSet withEvent:nil];
    
    OCMVerify([self.uiTouchMock locationInView:[OCMArg any]]);
}

- (void)testTouchesMovedCallsDrawLogicUpdateDrawing {
    [self.testRoomViewController touchesMoved:self.testTouchSet withEvent:nil];
    
    OCMVerify([[[self.drawLogicMock stub] ignoringNonObjectArgs] updateDrawing:self.testPoint]);
}

- (void)testTouchesEndedCallsUITouchLocationInView {
    [self.testRoomViewController touchesEnded:self.testTouchSet withEvent:nil];
    
    OCMVerify([self.uiTouchMock locationInView:[OCMArg any]]);
}

- (void)testTouchesEndedCallsDrawLogicEndDrawing {
    [self.testRoomViewController touchesEnded:self.testTouchSet withEvent:nil];
    
    OCMVerify([[[self.drawLogicMock stub] ignoringNonObjectArgs] endDrawing:self.testPoint]);
}

@end
