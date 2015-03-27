#ifndef WhiteboardiOS_SocketFactory_h
#define WhiteboardiOS_SocketFactory_h

#import <SIOSocket/SIOSocket.h>

@interface SocketFactory : NSObject

    + (void) createSocket:(NSString *)webAppURL onSuccess:(void(^)(SIOSocket *socket))success orFail:(void(^)())failure;

@end

#endif
