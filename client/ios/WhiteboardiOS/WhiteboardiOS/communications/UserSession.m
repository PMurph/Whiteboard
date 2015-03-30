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

-(void) authUser:(NSString*)login password:(NSString*)password cb:(void (^)(NSString* error, UserModel* user))cb {
    UserModel* user = [[UserModel alloc] init];
    NSDictionary* params = @{
                             @"login": login,
                             @"password": password
                             };
    
    
    [self.restkitWrapper
     userGetRequest:user
     parameters: params
     successCB:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult){
         self.currentUser.password = nil;
         [self authenticated:user];
         cb(nil, user);
     }
     failureCB:^(RKObjectRequestOperation *operation, NSError *error){
         cb(@"Authentication failed", nil);
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
     failureCB:^(RKObjectRequestOperation *operation, NSError *error){
         NSLog(@"Authentication failed");
     }
    ];
}

-(void) registerUser:(NSString*)login password:(NSString*)password cb:(void(^)(NSString* error, UserModel* user))cb {
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
            self.currentUser.password = nil;
            self.currentUser = user;
            cb(nil, user);
        }
        failureCB:^(RKObjectRequestOperation *operation, NSError *error){
            NSString* errorMsg = error.userInfo[@"NSLocalizedRecoverySuggestion"];
            cb([NSString stringWithFormat:@"Reistration failed: %@", errorMsg], nil);
        }
     ];
}
-(void) logout {
    UserModel* user = self.currentUser;
    user.status = @"offline";
    self.currentUser = nil;

    [self.restkitWrapper
        userPutRequest:user
        successCB:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult){
        }
        failureCB:^(RKObjectRequestOperation *operation, NSError *error){
        }
    ];
}

    -(void) save:(UserModel*)user cb: (void(^)(NSString* error, UserModel* user))cb {
        [self.restkitWrapper
         userPutRequest:user
         successCB:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult){
             cb(nil, user);
         }
         failureCB:^(RKObjectRequestOperation *operation, NSError *error){
             cb(@"Save failed", nil);
         }
         ];
    }

@end
