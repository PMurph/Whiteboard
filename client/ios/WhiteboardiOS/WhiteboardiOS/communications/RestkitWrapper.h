#ifndef WhiteboardiOS_RestkitWrapper_h
#define WhiteboardiOS_RestkitWrapper_h

#import <Restkit/RestKit.h>

#import "Collection.h"
#import "RoomModel.h"
#import "UserModel.h"

@interface RestkitWrapper : NSObject {
        RKObjectManager *objectManager;
        NSString *webAppURI;
    }

    - (id) init: (NSString *)webAppAPIURI;
    - (void) fetchRooms:(id<Collection>)collection withAuthentication:(NSString *)authToken cb:(void (^)())cb;
    - (void) userPostRequest:(UserModel*)user successCB:(void (^)(RKObjectRequestOperation *operation, RKMappingResult *mappingResult))successCB failureCB:(void (^)(RKObjectRequestOperation *operation, NSError *error))failureCB;
    - (void) userPutRequest:(UserModel*)user successCB:(void (^)(RKObjectRequestOperation *operation, RKMappingResult *mappingResult))successCB failureCB:(void (^)(RKObjectRequestOperation *operation, NSError *error))failureCB;

    - (void) userGetRequest:(UserModel*)user parameters:(NSDictionary*)params successCB:(void (^)(RKObjectRequestOperation *operation, RKMappingResult *mappingResult))successCB failureCB:(void (^)(RKObjectRequestOperation *operation, NSError *error))failureCB;
@end

#endif
