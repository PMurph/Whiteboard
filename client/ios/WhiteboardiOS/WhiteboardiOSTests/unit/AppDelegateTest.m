#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "AppDelegate.h"

@interface AppDelegateTest : XCTestCase
    @property (nonatomic, readwrite) AppDelegate *testAppDelegate;
    @property (nonatomic, readwrite) id restkitMock;
@end

@implementation AppDelegateTest

- (void)setUp {
    [super setUp];
    
    self.restkitMock = OCMClassMock([RestkitWrapper class]);
    
    self.testAppDelegate = [[AppDelegate alloc] init];
    self.testAppDelegate.restkitWrapper = self.restkitMock;
}

- (void)tearDown {
    [super tearDown];
}

- (void)testDidFinishLaunchingWithOptionsCallsRestkitFetch {
    [self.testAppDelegate application:nil didFinishLaunchingWithOptions:@{}];
    
}

- (void)testDidFinishLaunchingWithOptionsSetsUserPromise {
    [self.testAppDelegate application:nil didFinishLaunchingWithOptions:@{}];
    
}

@end
