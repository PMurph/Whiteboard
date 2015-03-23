#import "UserModel.h"

@interface UserModel ()
@end

@implementation UserModel

    @synthesize displayName;
    @synthesize anonymous;
    @synthesize authToken;
    @synthesize userId;

    - (id)init {
        displayName = @"";
        anonymous = YES;
        authToken = @"";
        userId = @"";
        return self;
    }
@end