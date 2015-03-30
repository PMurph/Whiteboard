//
//  UserSession.h
//  WhiteboardiOS
//
//  Created by Reyad on 2015-03-28.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#ifndef WhiteboardiOS_UserSession_h
#define WhiteboardiOS_UserSession_h

#import "UserModel.h"
#import "RestkitWrapper.h"

@interface UserSession : NSObject

@property (nonatomic, readwrite) UserModel* currentUser;
@property (nonatomic, readwrite) RestkitWrapper* restkitWrapper;
@property (nonatomic, readwrite) NSMutableArray* authCallbacks;

- (id)init:(RestkitWrapper*)restkitWrapper;
-(void) authUser:(NSString*)login password:(NSString*)password cb:(void (^)(NSString* error, UserModel* user))cb;
-(void) authAnonymous;
-(void) registerUser:(NSString*)login password:(NSString*)password cb:(void(^)(NSString* error, UserModel* user))cb;
-(void) save:(UserModel*)user cb: (void(^)(NSString* error, UserModel* user))cb;
-(void) addAuthCB:(void(^)())cb;

@end

#endif