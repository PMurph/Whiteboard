#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "DrawModel.H"

@interface DrawModelTest : XCTestCase
    @property (nonatomic, readwrite) DrawModel *testDrawModel;
    @property (nonatomic, readwrite) id drawObjectMock;
@end

@implementation DrawModelTest

- (void)setUp {
    [super setUp];
    self.drawObjectMock = OCMClassMock([DrawObject class]);
    OCMStub([self.drawObjectMock setColour:[OCMArg any]]);
    OCMStub([self.drawObjectMock setTool:[OCMArg any]]);
    
    self.testDrawModel = [[DrawModel alloc] initWithDrawInfo:self.drawObjectMock];
}

- (void)tearDown {
    [super tearDown];
}

- (void)testSetColourCallsDrawObject {
    NSString *testString = @"test";
    [self.testDrawModel setColour:testString];
    OCMVerify([self.drawObjectMock setColour:testString]);
}

- (void)testSetToolCallsDrawObject {
    NSString *testString = @"test";
    [self.testDrawModel setTool:testString];
    OCMVerify([self.drawObjectMock setTool:testString]);
}

- (void)testDefaultThickness {
    XCTAssertEqual([self.testDrawModel thickness].intValue, 1);
}

- (void)testSetThicknessValidThickness {
    [self.testDrawModel setThickness:[NSNumber numberWithInt:50]];
    XCTAssertEqual([self.testDrawModel thickness].intValue, 50);
}

- (void)testSetThicknessMinThickness {
    [self.testDrawModel setThickness:[NSNumber numberWithInt:MIN_THICKNESS]];
    XCTAssertEqual([self.testDrawModel thickness].intValue, MIN_THICKNESS);
}

- (void)testSetThicknessMaxThickness {
    [self.testDrawModel setThickness:[NSNumber numberWithInt:(MAX_THICKNESS-1)]];
    XCTAssertEqual([self.testDrawModel thickness].intValue, (MAX_THICKNESS-1));
}

- (void)testSetInvalidGreaterThanThickness {
    [self.testDrawModel setThickness:[NSNumber numberWithInt:MAX_THICKNESS]];
    XCTAssertEqual([self.testDrawModel thickness].intValue, 1);
}

- (void)testSetInvalidLessThanThickness {
    [self.testDrawModel setThickness:[NSNumber numberWithInt:(MIN_THICKNESS - 1)]];
    XCTAssertEqual([self.testDrawModel thickness].intValue, 1);
}

- (void)testNoDefaultCoordinates {
    XCTAssertEqual([[self.testDrawModel listOfCoordinates] count], 0);
}

- (void)testAddingCoordinates {
    [self.testDrawModel addCoordinateX:[NSNumber numberWithInt:15] Y:[NSNumber numberWithInt:12]];
    XCTAssertEqual([[self.testDrawModel listOfCoordinates] count], 1);
}

@end
