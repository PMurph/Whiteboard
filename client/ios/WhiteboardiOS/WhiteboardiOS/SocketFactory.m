#import "SocketFactory.h"

@interface SocketFactory ()

@end

@implementation SocketFactory

    + (void) createSocket:(NSString *)webAppURL onSuccess:(void (^)(SIOSocket *))success orFail:(void (^)())failure {
        [SIOSocket socketWithHost:webAppURL response:^(SIOSocket *socket) {
            if(socket) {
                success(socket);
            } else {
                failure();
            }
        }];
    }

@end