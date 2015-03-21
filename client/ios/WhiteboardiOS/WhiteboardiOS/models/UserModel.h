//
//  UserModel.h
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-19.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#ifndef WhiteboardiOS_UserModel_h
#define WhiteboardiOS_UserModel_h

#import <Foundation/Foundation.h>

@interface UserModel : NSObject

    @property (nonatomic, copy) NSString *displayName;
    @property (nonatomic) BOOL anonymous;
    @property (nonatomic, copy) NSString *authToken;
    @property (nonatomic, copy) NSString *userId;
    @property (nonatomic) BOOL saveSession;

@end

#endif
