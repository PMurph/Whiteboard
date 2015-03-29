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
    return self;
}

-(void) authenticated {
    
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

         self.currentUser = user;
         
         cb(nil);
     }
     failureCB:^(RKObjectRequestOperation *operation, NSError *error){
         cb(@"Authentication failed");
     }
     ];
    
}

-(void) authAnonymous {
    UserModel* user = [[UserModel alloc] init];

    user.anonymous = @YES;
    [self.restkitWrapper
     userPostRequest:user
     successCB:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult){
         self.currentUser = user;
        }
    ];
}

@end
