#ifndef WhiteboardiOS_UserPromise_h
#define WhiteboardiOS_UserPromise_h

#import "UserModel.h"

@interface UserPromise : NSObject

    @property (nonatomic, readwrite) UserModel* userModel;

    - (id)init;
@end

#endif
