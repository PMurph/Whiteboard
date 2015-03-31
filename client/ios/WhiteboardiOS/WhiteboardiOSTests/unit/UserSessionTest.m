//
//  UserSessionControllerTest.m
//  WhiteboardiOS
//
//  Created by Reyad on 2015-03-30.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>

#import "DashboardViewController.h"

@interface UserSessionTest : XCTestCase
@property (nonatomic, readwrite) RestkitWrapper* restkitMock;
@property (nonatomic, readwrite) UserSession* userSession;
@end

@implementation UserSessionTest
- (void)setUp {
    [super setUp];
    
    self.restkitMock = OCMClassMock([RestkitWrapper class]);
    self.userSession = [[UserSession alloc] init:self.restkitMock];

}

- (void)tearDown {
    [super tearDown];
}

- (void)testAuthAnonymous {
    [self.userSession authAnonymous];

    OCMVerify([self.restkitMock userPostRequest:[OCMArg any] successCB:[OCMArg any] failureCB:[OCMArg any]]);
}

- (void)testAuthUser {
    [self.userSession authUser:@"testUser" password:@"" cb:^(NSString* error, UserModel* userModel){}];
    
    OCMVerify([self.restkitMock userGetRequest:[OCMArg any] parameters:[OCMArg any] successCB:[OCMArg any] failureCB:[OCMArg any]]);
}
- (void)testRegisterUser {
    [self.userSession setCurrentUser:[UserModel alloc]];
    [self.userSession registerUser:@"TestUser" password:@"testPassword" cb:^(NSString* error, UserModel* userModel){}];
    
    OCMVerify([self.restkitMock userPutRequest:[OCMArg any] successCB:[OCMArg any] failureCB:[OCMArg any]]);
}


@end