#import <XCTest/XCTest.h>

#import "DrawToolModel.h"

@interface DrawToolModelTest : XCTestCase
    @property (nonatomic, readwrite) DrawToolModel *testDrawToolModel;
@end

@implementation DrawToolModelTest

- (void)setUp {
    [super setUp];
    self.testDrawToolModel = [[DrawToolModel alloc] init];
}

- (void)tearDown {
    [super tearDown];
}

- (void)testDefaultDrawObjectReturnsBlack {
    XCTAssertEqual([[[self.testDrawToolModel myColour] objectAtIndex:0] floatValue], 0.0f);
    XCTAssertEqual([[[self.testDrawToolModel myColour] objectAtIndex:1] floatValue], 0.0f);
    XCTAssertEqual([[[self.testDrawToolModel myColour] objectAtIndex:2] floatValue], 0.0f);
}

- (void)testDefaultDrawObjectReturnsDraw {
    XCTAssertEqual([self.testDrawToolModel myTool], DRAW);
}

- (void)testSettingValidNewColour {
    [self.testDrawToolModel setColour:@"blue"];
    XCTAssertEqual([[[self.testDrawToolModel myColour] objectAtIndex:0] floatValue], 0.0f);
    XCTAssertEqual([[[self.testDrawToolModel myColour] objectAtIndex:1] floatValue], 0.0f);
    XCTAssertEqual([[[self.testDrawToolModel myColour] objectAtIndex:2] floatValue], 1.0f);
}

- (void)testGetRedReturnsCorrectValue {
    [self.testDrawToolModel setColour:@"red"];
    XCTAssertEqual([[self.testDrawToolModel getRed] floatValue], 1.0f);
}

- (void)testGetGreenReturnsCorrectValue {
    [self.testDrawToolModel setColour:@"green"];
    XCTAssertEqual([[self.testDrawToolModel getGreen] floatValue], 1.0f);
}

- (void)testGetBlueReturnsCorrectValue {
    [self.testDrawToolModel setColour:@"blue"];
    XCTAssertEqual([[self.testDrawToolModel getBlue] floatValue], 1.0f);
}

- (void)testSettingValidNewTool {
    [self.testDrawToolModel setTool:@"erase"];
    XCTAssertEqual([self.testDrawToolModel myTool], ERASE);
}

- (void)testSettingInvalidNewColour {
    [self.testDrawToolModel setColour:@"not a colour"];
    XCTAssertEqual([[[self.testDrawToolModel myColour] objectAtIndex:0] floatValue], 0.0f);
    XCTAssertEqual([[[self.testDrawToolModel myColour] objectAtIndex:1] floatValue], 0.0f);
    XCTAssertEqual([[[self.testDrawToolModel myColour] objectAtIndex:2] floatValue], 0.0f);
}

- (void)testSettingInvalidNewTool {
    [self.testDrawToolModel setTool:@"not a tool"];
    XCTAssertEqual([self.testDrawToolModel myTool], DRAW);
}

- (void)testDefaultThickness {
    XCTAssertEqual([self.testDrawToolModel thickness].intValue, 1);
}

- (void)testSetThicknessValidThickness {
    [self.testDrawToolModel setThickness:[NSNumber numberWithInt:50]];
    XCTAssertEqual([self.testDrawToolModel thickness].intValue, 50);
}

- (void)testSetThicknessMinThickness {
    [self.testDrawToolModel setThickness:[NSNumber numberWithInt:MIN_THICKNESS]];
    XCTAssertEqual([self.testDrawToolModel thickness].intValue, MIN_THICKNESS);
}

- (void)testSetThicknessMaxThickness {
    [self.testDrawToolModel setThickness:[NSNumber numberWithInt:(MAX_THICKNESS-1)]];
    XCTAssertEqual([self.testDrawToolModel thickness].intValue, (MAX_THICKNESS-1));
}

- (void)testSetInvalidGreaterThanThickness {
    [self.testDrawToolModel setThickness:[NSNumber numberWithInt:MAX_THICKNESS]];
    XCTAssertEqual([self.testDrawToolModel thickness].intValue, 1);
}

- (void)testSetInvalidLessThanThickness {
    [self.testDrawToolModel setThickness:[NSNumber numberWithInt:(MIN_THICKNESS - 1)]];
    XCTAssertEqual([self.testDrawToolModel thickness].intValue, 1);
}

@end
