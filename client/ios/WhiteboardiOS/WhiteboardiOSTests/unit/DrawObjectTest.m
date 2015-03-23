#import <XCTest/XCTest.h>

#import "DrawObject.h"

@interface DrawObjectTest : XCTestCase
    @property (nonatomic, readwrite) DrawObject *testDrawObject;
@end

@implementation DrawObjectTest

- (void)setUp {
    [super setUp];
    self.testDrawObject = [[DrawObject alloc] init];
}

- (void)tearDown {
    [super tearDown];
}

- (void)testDefaultDrawObjectReturnsBlack {
    XCTAssertEqual([self.testDrawObject myColour], BLACK);
}

- (void)testDefaultDrawObjectReturnsDraw {
    XCTAssertEqual([self.testDrawObject myTool], DRAW);
}

- (void)testSettingValidNewColour {
    [self.testDrawObject setColour:@"blue"];
    XCTAssertEqual([self.testDrawObject myColour], BLUE);
}

- (void)testSettingValidNewTool {
    [self.testDrawObject setTool:@"erase"];
    XCTAssertEqual([self.testDrawObject myTool], ERASE);
}

- (void)testSettingInvalidNewColour {
    [self.testDrawObject setColour:@"not a colour"];
    XCTAssertEqual([self.testDrawObject myColour], BLACK);
}

- (void)testSettingInvalidNewTool {
    [self.testDrawObject setTool:@"not a tool"];
    XCTAssertEqual([self.testDrawObject myTool], DRAW);
}

@end
