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
        [self setupUserModelResponseDescriptor];
    }

    - (void) setupRoomModelResponseDescriptor {
        RKObjectMapping *roomModelMapping = [RKObjectMapping mappingForClass:[RoomModel class]];
        [roomModelMapping addAttributeMappingsFromDictionary:@{
            @"_id": @"roomId"
        }];
    
        RKResponseDescriptor* roomResponseDescriptor = [RKResponseDescriptor
            responseDescriptorWithMapping:roomModelMapping
            method:RKRequestMethodGET
            pathPattern: @"/api/room"
            keyPath: nil
            statusCodes:[NSIndexSet indexSetWithIndex:200]];
    
        [objectManager addResponseDescriptor:roomResponseDescriptor];
    }

    - (void) setupUserModelResponseDescriptor {
        RKObjectMapping* userModelMapping = [RKObjectMapping mappingForClass:[UserModel class]];
        [userModelMapping addAttributeMappingsFromDictionary:@{
            @"displayName": @"displayName",
            @"anonymous": @"anonymous",
            @"authToken": @"authToken",
            @"_id": @"userId"
        }];
        
        RKResponseDescriptor *userResponseDescriptor = [RKResponseDescriptor
            responseDescriptorWithMapping:userModelMapping
            method:RKRequestMethodPOST
            pathPattern: @"/api/user"
            keyPath: nil
            statusCodes:[NSIndexSet indexSetWithIndex:200]];
        
        [objectManager addResponseDescriptor:userResponseDescriptor];
    }

    - (void) fetchRooms:(id<Collection>)collection withAuthentication:(NSString *)authToken {
        [[RKObjectManager sharedManager] getObjectsAtPath:@"/api/room"
            parameters:@{@"authToken": authToken}
            success:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult) {
                [collection setCollection:mappingResult.array];
            }
        failure:^(RKObjectRequestOperation *operation, NSError *error) {
            NSLog(@"Could not retrieve list of room ids from server.");
        }];
    }

    - (UserPromise *) fetchUser {
        UserPromise *thePromise = [[UserPromise alloc] init];
        [[RKObjectManager sharedManager] postObject:nil
            path:@"/api/user"
            parameters:@{@"anonymous":@YES}
            success:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult) {
                [thePromise setUserModel:[mappingResult.array objectAtIndex:0]];
            }
            failure:^(RKObjectRequestOperation *operation, NSError *error) {
                NSLog(@"Could not retrieve user form the server.");
            }];
        return thePromise;
    }
@end