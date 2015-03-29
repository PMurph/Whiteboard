#import "UserModel.h"

@interface UserModel ()
@end

@implementation UserModel

    @synthesize displayName;
    @synthesize anonymous;
    @synthesize authToken;
    @synthesize userId;
    @synthesize login;
@synthesize password;

    - (id) init {
        displayName = @"";
        anonymous = YES;
        authToken = @"";
        userId = @"";
        login = @"";
        password = @"";
        return self;
    }
@end