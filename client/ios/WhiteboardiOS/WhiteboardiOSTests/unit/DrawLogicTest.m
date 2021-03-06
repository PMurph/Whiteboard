#import <XCTest/XCTest.h>

#import "DrawLogic.h"

@interface DrawLogicTest : XCTestCase {
        CGPoint testPoint;
    }
    @property (nonatomic, readwrite) DrawLogic *testDrawLogic;
    @property (nonatomic, readwrite) NSDictionary *testDrawTool;
    @property (nonatomic, readwrite) DrawToolModel *testDrawToolModel;
    @property (nonatomic, readwrite) DrawModel *testDrawModel;
@end

@implementation DrawLogicTest

- (void)setUp {
    [super setUp];
    
    self.testDrawTool = @{@"colour": @"Blue", @"thickness": @5, @"type": @"Draw"};
    testPoint.x = 5;
    testPoint.y = 1.45;
    
    self.testDrawLogic = [[DrawLogic alloc] init];
    self.testDrawToolModel = [DrawLogic createDrawToolModel:self.testDrawTool];
    self.testDrawModel = [DrawLogic createDrawModel:self.testDrawToolModel];
}

- (void)tearDown {
    [super tearDown];
}

#pragma mark createDrawToolModel tests
- (void)testCreateDrawToolModelDoesNotReturnNil {
    XCTAssertNotNil([DrawLogic createDrawToolModel:self.testDrawTool]);
}

- (void)testCreateDrawToolModelReturnsDrawToolModelWithCorrectColour {
    XCTAssertEqual([[self.testDrawToolModel.myColour objectAtIndex:0] floatValue], 0.0f);
    XCTAssertEqual([[self.testDrawToolModel.myColour objectAtIndex:1] floatValue], 0.0f);
    XCTAssertEqual([[self.testDrawToolModel.myColour objectAtIndex:2] floatValue], 1.0f);
}

- (void)testCreateDrawToolModelReturnsDrawToolModelWithCorrectTool {
    XCTAssertEqual(self.testDrawToolModel.myTool, DRAW);
}

- (void)testCreateDrawToolModelReturnsDrawToolModelWithCorrectThickness {
    XCTAssertEqual(self.testDrawToolModel.thickness, @5);
}

- (void)testCreateDrawToolModelReturnsNilIfKeysNoInTools {
    XCTAssertNil([DrawLogic createDrawToolModel:@{}]);
}

#pragma mark createDrawModel tests
- (void)testCreateDrawModelDoesNotReturnNil {
    XCTAssertNotNil([DrawLogic createDrawModel:self.testDrawToolModel]);
}

- (void)testCreateDrawModelReturnsDrawModelWithCorrectDrawTool {
    XCTAssertEqual(self.testDrawModel.drawTool, self.testDrawToolModel);
}

- (void)testCreateDrawModelReturnsDrawModelWithNoVertices {
    XCTAssertEqual([self.testDrawModel.listOfCoordinates count], 0);
}

- (void)testCreateDrawModelReturnsNilIfToolIsNil {
    XCTAssertNil([DrawLogic createDrawModel:nil]);
}

- (void)testCreateDrawModelWithCoordinatesNotNil {
    XCTAssertNotNil([DrawLogic createDrawModel:self.testDrawToolModel withCoordinates:@[]]);
}

- (void)testCreateDrawModelWithCoordinatesNilIfNoDrawToolModel {
    XCTAssertNil([DrawLogic createDrawModel:nil withCoordinates:@[]]);
}

- (void)testCreateDrawModelWithCoordinatsNilIfNilCoord {
    XCTAssertNil([DrawLogic createDrawModel:self.testDrawToolModel withCoordinates:nil]);
}

#pragma mark drawing tests
- (void)testEndDrawingShouldReturnNilIfStartDrawingHasNotBeenCalled {
    XCTAssertNil([self.testDrawLogic endDrawing:testPoint]);
}

- (void)testEndDrawingShouldReturnNotNilIfStartDrawingCalledBeforeEndDrawing {
    [self.testDrawLogic startDrawing:self.testDrawToolModel atPoint:testPoint];
    XCTAssertNotNil([self.testDrawLogic endDrawing:testPoint]);
}

- (void)testMultipleEndDrawingCallsInARowShouldReturnNil {
    [self.testDrawLogic startDrawing:self.testDrawToolModel atPoint:testPoint];
    [self.testDrawLogic endDrawing:testPoint];
    XCTAssertNil([self.testDrawLogic endDrawing:testPoint]);
}

- (void)testReturnedDrawModelShouldOnlyHaveCoordinatesAdded {
    [self.testDrawLogic startDrawing:self.testDrawToolModel atPoint:testPoint];
    [self.testDrawLogic updateDrawing:testPoint];
    XCTAssertEqual([[self.testDrawLogic endDrawing:testPoint].listOfCoordinates count], 3);
}

- (void)testMultipleStartsWithoutEndShouldNotOverwritePreviousDrawModel {
    [self.testDrawLogic startDrawing:self.testDrawToolModel atPoint:testPoint];
    [self.testDrawLogic updateDrawing:testPoint];
    [self.testDrawLogic startDrawing:self.testDrawToolModel atPoint:testPoint];
    XCTAssertEqual([[self.testDrawLogic endDrawing:testPoint].listOfCoordinates count], 3);
}

@end
