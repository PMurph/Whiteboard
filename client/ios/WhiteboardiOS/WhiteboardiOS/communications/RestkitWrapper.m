#import "RestkitWrapper.h"

@interface RestkitWrapper ()
    - (void) configureRestKit;
    - (void) setupRoomModelResponseDescriptor;
    - (void) setupUserModelRequestDescriptor;
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

    - (void) setupRoomModelResponseDescriptor {
        RKObjectMapping *roomModelMapping = [RKObjectMapping mappingForClass:[RoomModel class]];
        [roomModelMapping addAttributeMappingsFromDictionary:@{
            @"_id": @"roomId"
        }];
    
        RKResponseDescriptor* roomResponseDescriptor = [RKResponseDescriptor
            responseDescriptorWithMapping:roomModelMapping
            method:RKRequestMethodGET
            pathPattern: nil
            keyPath: nil
            statusCodes:[NSIndexSet indexSetWithIndex:200]];
    
        [objectManager addResponseDescriptor:roomResponseDescriptor];
    }

    - (void)setupUserModelRequestDescriptor {
        RKObjectMapping *userModelMapping = [RKObjectMapping requestMapping];
        [userModelMapping addAttributeMappingsFromDictionary:@{
            @"anonymous": @"anonymous"
        }];
        
        RKRequestDescriptor *userRequestDescriptor = [RKRequestDescriptor requestDescriptorWithMapping:userModelMapping objectClass:[UserModel class]
            rootKeyPath:nil
            method:RKRequestMethodPOST];
        
        [objectManager addRequestDescriptor:userRequestDescriptor];
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
            pathPattern: nil
            keyPath: nil
            statusCodes:[NSIndexSet indexSetWithIndex:200]];
        
        [objectManager addResponseDescriptor:userResponseDescriptor];
    }

    - (void) fetchRooms:(id<Collection>)collection {
        [[RKObjectManager sharedManager] getObjectsAtPath:@"/api/room"
            parameters:nil
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