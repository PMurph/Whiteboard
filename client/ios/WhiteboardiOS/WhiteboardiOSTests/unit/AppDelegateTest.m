#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "AppDelegate.h"

@interface AppDelegateTest : XCTestCase
    @property (nonatomic, readwrite) AppDelegate *testAppDelegate;
    @property (nonatomic, readwrite) id restkitMock;
    @property (nonatomic, readwrite) UserPromise *testUserPromise;
@end

@implementation AppDelegateTest

- (void)setUp {
    [super setUp];
    self.testUserPromise = [[UserPromise alloc] init];
    
    self.restkitMock = OCMClassMock([RestkitWrapper class]);
    OCMStub([self.restkitMock fetchUser]).andReturn(self.testUserPromise);
    
    self.testAppDelegate = [[AppDelegate alloc] init];
    self.testAppDelegate.restkitWrapper = self.restkitMock;
}

- (void)tearDown {
    [super tearDown];
}

- (void)testDidFinishLaunchingWithOptionsCallsRestkitFetch {
    [self.testAppDelegate application:nil didFinishLaunchingWithOptions:@{}];
    
    OCMVerify([self.restkitMock fetchUser]);
}

- (void)testDidFinishLaunchingWithOptionsSetsUserPromise {
    [self.testAppDelegate application:nil didFinishLaunchingWithOptions:@{}];
    
    XCTAssertEqual(self.testAppDelegate.userPromise, self.testUserPromise);
}

@end
