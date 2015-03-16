//
//  RestkitWrapper.m
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-14.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "RestkitWrapper.h"

@interface RestkitWrapper ()
    - (void) configureRestKit;
    - (void) setupRoomModelResponseDescriptor;
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
        RKObjectMapping* roomIdMapping = [RKObjectMapping mappingForClass:[RoomModel class]];
        [roomIdMapping addAttributeMappingsFromDictionary:@{
            @"_id": @"roomId"
        }];
    
        RKResponseDescriptor* roomResponseDescriptor = [RKResponseDescriptor
            responseDescriptorWithMapping:roomIdMapping
            method:RKRequestMethodGET
            pathPattern: nil
            keyPath: nil
            statusCodes:[NSIndexSet indexSetWithIndex:200]];
    
        [objectManager addResponseDescriptor:roomResponseDescriptor];
    }

    - (void) updateRoomIds {
        [[RKObjectManager sharedManager] getObjectsAtPath:@"/api/room"
            parameters:nil
            success:^(RKObjectRequestOperation* operation, RKMappingResult* mappingResult) {
                _roomIds = mappingResult.array;
            }
        failure:^(RKObjectRequestOperation* operation, NSError *error) {
            NSLog(@"Could not retrieve list of room ids from server.");
        }];
    }
@end