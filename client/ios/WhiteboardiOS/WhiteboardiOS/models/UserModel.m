#import "UserModel.h"

@interface UserModel ()
@end

@implementation UserModel

    @synthesize displayName;
    @synthesize status;
    @synthesize anonymous;
    @synthesize authToken;
    @synthesize userId;
    @synthesize login;
    @synthesize password;

    - (id) init {
        displayName = @"";
        status = @"online";
        anonymous = YES;
        authToken = @"";
        userId = nil;
        login = @"";
        password = nil;
        return self;
    }
@end