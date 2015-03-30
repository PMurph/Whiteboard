#import "RestkitWrapper.h"

@interface RestkitWrapper ()
    - (void) configureRestKit;
    - (void) setupRoomModelResponseDescriptor;
    - (void) setupUserModelResponseDescriptor;
@end

@implementation RestkitWrapper

    - (id) init: (NSString *) uri {
        webAppURI = uri;
        [self configureRestKit];
        return self;
    }

    - (void) configureRestKit {
        NSURL* webAppURL = [NSURL URLWithString:webAppURI];
        AFHTTPClient* client = [[AFHTTPClient alloc] initWithBaseURL:webAppURL];
    
        objectManager = [[RKObjectManager alloc] initWithHTTPClient:client];
        objectManager.requestSerializationMIMEType = RKMIMETypeJSON;
        [self setupRoomModelResponseDescriptor];
        [self setupUserModelRequestDescriptor];
        [self setupUserModelResponseDescriptor];
    }

    - (RKObjectMapping*) getUserModelMapping {
        RKObjectMapping* userMapping = [RKObjectMapping requestMapping];
        [userMapping addAttributeMappingsFromDictionary:@{@"login": @"login",
                                                           @"password":@"password",
                                                           @"anonymous": @"anonymous",
                                                           @"authToken":@"authToken",
                                                           @"status":@"status",
                                                           @"displayName":@"displayName",
                                                           @"userId": @"_id"}];
        [userMapping setSetDefaultValueForMissingAttributes:NO];
        return userMapping;
    }

    - (void) setupUserModelRequestDescriptor {
        RKObjectMapping* userMap = [self getUserModelMapping];
        RKRequestDescriptor* userRequestDescriptor = [RKRequestDescriptor
                                                      requestDescriptorWithMapping:userMap
                                                        objectClass:[UserModel class]
                                                        rootKeyPath:nil
                                                        method:RKRequestMethodAny];
        
        [objectManager addRequestDescriptor: userRequestDescriptor];
    }

    - (void) setupRoomModelResponseDescriptor {
        RKObjectMapping *roomModelMapping = [RKObjectMapping mappingForClass:[RoomModel class]];
        [roomModelMapping addAttributeMappingsFromDictionary:@{
            @"_id": @"roomId",
            @"name": @"name",
            @"type": @"type"
        }];
    
        RKResponseDescriptor* roomResponseDescriptor = [RKResponseDescriptor
            responseDescriptorWithMapping:roomModelMapping
            method:RKRequestMethodAny
            pathPattern: @"api/room"
            keyPath: nil
            statusCodes:[NSIndexSet indexSetWithIndex:200]];
    
        [objectManager addResponseDescriptor:roomResponseDescriptor];
    }

    - (void) setupUserModelResponseDescriptor {
        RKObjectMapping* userModelMapping = [RKObjectMapping mappingForClass:[UserModel class]];
        [userModelMapping addAttributeMappingsFromDictionary:@{
            @"displayName": @"displayName",
            @"status":@"status",
            @"anonymous": @"anonymous",
            @"authToken": @"authToken",
            @"login": @"login",
            @"_id": @"userId"
        }];
        
        RKResponseDescriptor *userResponseDescriptor = [RKResponseDescriptor
            responseDescriptorWithMapping:userModelMapping
            method:RKRequestMethodAny
            pathPattern:@"api/user"
            keyPath: nil
            statusCodes:[NSIndexSet indexSetWithIndex:200]];
        
        [objectManager addResponseDescriptor:userResponseDescriptor];
    }

- (void) fetchRooms:(id<Collection>)collection withAuthentication:(NSString *)authToken cb:(void (^)())cb{
        [[RKObjectManager sharedManager] getObjectsAtPath:@"/api/room"
            parameters:@{@"authToken": authToken}
            success:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult) {
                [collection setCollection:mappingResult.array];
                cb();
            }
        failure:^(RKObjectRequestOperation *operation, NSError *error) {
            NSLog(@"Could not retrieve list of room ids from server.");
        }];
    }

- (void) userPostRequest:(UserModel*)user successCB:(void (^)(RKObjectRequestOperation *operation, RKMappingResult *mappingResult))successCB failureCB:(void (^)(RKObjectRequestOperation *operation, NSError *error))failureCB
    {
        [[RKObjectManager sharedManager] postObject:user
            path:@"/api/user"
            parameters:nil
            success: successCB
            failure:failureCB
         ];
   }
- (void) userPutRequest:(UserModel*)user successCB:(void (^)(RKObjectRequestOperation *operation, RKMappingResult *mappingResult))successCB failureCB:(void (^)(RKObjectRequestOperation *operation, NSError *error))failureCB
{
    [[RKObjectManager sharedManager] putObject:user
                                           path:@"/api/user"
                                     parameters:nil
                                        success: successCB
                                        failure:failureCB
     ];
}
- (void) userGetRequest:(UserModel*)user parameters:(NSDictionary*)params successCB:(void (^)(RKObjectRequestOperation *operation, RKMappingResult *mappingResult))successCB failureCB:(void (^)(RKObjectRequestOperation *operation, NSError *error))failureCB
{
    [[RKObjectManager sharedManager] getObject:user
            path:@"/api/user"
            parameters:params
            success: successCB
            failure:failureCB
     ];
}
@end