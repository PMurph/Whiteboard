#ifndef WhiteboardiOS_UserModel_h
#define WhiteboardiOS_UserModel_h

#import <Foundation/Foundation.h>

@interface UserModel : NSObject

    @property (nonatomic, strong) NSString *displayName;
    @property (nonatomic) BOOL anonymous;
    @property (nonatomic, strong) NSString *authToken;
    @property (nonatomic, strong) NSString *userId;

    - (id)init;
@end

#endif
