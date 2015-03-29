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

-(void) authAnonymous {
    UserModel* user = [[UserModel alloc] init];
    user.login = @"test";
    user.password = @"test2";
    user.anonymous = @YES;
    [self.restkitWrapper
     userPostRequest:user
     successCB:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult){
         self.currentUser = user;
        }
    ];
}

@end
