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
        [self setupRoomModelResponseDescriptor];
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

    - (void) setupUserModelResponseDescriptor {
        RKObjectMapping* userModelMapping = [RKObjectMapping mappingForClass:[UserModel class]];
        [userModelMapping addAttributeMappingsFromDictionary:@{
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

    - (void) fetchUser {
        [[RKObjectManager sharedManager] getObjectsAtPath:@"/api/user"
        parameters:nil
        success:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult) {
            NSLog(@"Retrieved user");
        }
        failure:^(RKObjectRequestOperation *operation, NSError *error) {
            NSLog(@"Could not retrieve user form the server.");
        }];
    }
@end