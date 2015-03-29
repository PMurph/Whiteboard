//
//  UserSession.m
//  WhiteboardiOS
//
//  Created by Reyad on 2015-03-27.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "UserSession.h"

@implementation UserSession

- (id) init: (RestkitWrapper *)restkitWrapper {
    self.restkitWrapper = restkitWrapper;
    self.authCallbacks = [NSMutableArray array];
    return self;
}

-(void) authenticated:(UserModel*)user {
    self.currentUser = user;

    for(void(^cb)() in self.authCallbacks){
        cb();
    }
}

-(void) addAuthCB:(void(^)())cb {
    [self.authCallbacks addObject: cb];
}

-(void) authUser:(NSString*)login password:(NSString*)password cb:(void (^)(NSString* error))cb {
    UserModel* user = [[UserModel alloc] init];
    NSDictionary* params = @{
                             @"login": login,
                             @"password": password
                             };
    
    
    [self.restkitWrapper
     userGetRequest:user
     parameters: params
     successCB:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult){
         [self authenticated:user];
         cb(nil);
     }
     failureCB:^(RKObjectRequestOperation *operation, NSError *error){
         cb(@"Authentication failed");
     }
     ];
    
}

-(void) authAnonymous {
    UserModel* user = [[UserModel alloc] init];

    user.anonymous = YES;
    [self.restkitWrapper
     userPostRequest:user
     successCB:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult){
         [self authenticated:user];
        }
    ];
}

-(void) registerUser:(NSString*)login password:(NSString*)password cb:(void(^)(NSString* error))cb {
    UserModel* user = self.currentUser;
    if (!user) {
        NSLog(@"Register user need's anonymous user model");
        return;
    }
    user.login = login;
    user.password = password;
    user.anonymous = NO;
    
    [self.restkitWrapper
     userPutRequest:user
     successCB:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult){
         self.currentUser = user;
         cb(nil);
     }
     ];
}
@end
