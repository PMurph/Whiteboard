#import "SocketFactory.h"

static NSMutableArray *sockets = nil;

@interface SocketFactory ()

@end

@implementation SocketFactory

    + (void) createSocket:(NSString *)webAppURL onSuccess:(void (^)(SIOSocket *))success orFail:(void (^)())failure {
        [SIOSocket socketWithHost:webAppURL response:^(SIOSocket *socket) {
            if(socket) {
                if(!sockets) {
                    sockets = [[NSMutableArray alloc] init];
                }
                [sockets addObject:socket];
                success(socket);
            } else {
                failure();
            }
        }];
    }

@end