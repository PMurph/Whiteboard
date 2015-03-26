#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "DrawModel.h"

@interface DrawModelTest : XCTestCase
    @property (nonatomic, readwrite) DrawModel *testDrawModel;
    @property (nonatomic, readwrite) id drawObjectMock;
    @property (nonatomic, readwrite) NSArray *testCoordinates;
@end

@implementation DrawModelTest

- (void)setUp {
    [super setUp];
    self.drawObjectMock = OCMClassMock([DrawToolModel class]);
    OCMStub([self.drawObjectMock setColour:[OCMArg any]]);
    OCMStub([self.drawObjectMock setTool:[OCMArg any]]);
    OCMStub([self.drawObjectMock setThickness:[OCMArg any]]);
    
    self.testDrawModel = [[DrawModel alloc] initWithDrawTool:self.drawObjectMock];
    self.testCoordinates = @[@{@"x":@5, @"y":@1}, @{@"x":@-15, @"y":@1}];
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

- (void)testSetThicknessCallsDrawObject {
    [self.testDrawModel setThickness:@5];
    OCMVerify([self.drawObjectMock setThickness:@5]);
}

- (void)testNoDefaultCoordinates {
    XCTAssertEqual([[self.testDrawModel listOfCoordinates] count], 0);
}

- (void)testAddingCoordinates {
    [self.testDrawModel addCoordinateX:[NSNumber numberWithInt:15] Y:[NSNumber numberWithInt:12]];
    XCTAssertEqual([[self.testDrawModel listOfCoordinates] count], 1);
}

- (void)testSettingCoordinates {
    [self.testDrawModel setCoordinates:self.testCoordinates];
    XCTAssertEqual([self.testDrawModel.listOfCoordinates count], [self.testCoordinates count]);
}

@end
