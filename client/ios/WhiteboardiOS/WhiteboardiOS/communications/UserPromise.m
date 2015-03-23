#import "UserPromise.h"

@interface UserPromise ()
@end

@implementation UserPromise

    - (id) init {
        self.userModel = [[UserModel alloc] init];
        return self;
    }

@end
