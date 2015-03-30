#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "DashboardViewController.h"

@interface UserSessionTest : XCTestCase
@property (nonatomic, readwrite) id roomCollectionMock;
@property (nonatomic, readwrite) NSArray *testRoomModels;
@property (nonatomic, readwrite) DashboardViewController *testDashboardViewController;
@end

@implementation UserSessionTest

@end