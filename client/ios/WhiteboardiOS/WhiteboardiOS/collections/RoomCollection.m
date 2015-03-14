//
//  RoomCollection.m
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-13.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "RoomCollection.h"

@interface RoomCollection ()

@end

@implementation RoomCollection

- (id) init {
    [self configureRestKit];
    [self getRoomIds];
    
    return self;
}

- (void) configureRestKit {
    NSURL* webAppURL = [NSURL URLWithString:@"http://ec2-54-68-246-235.us-west-2.compute.amazonaws.com/"];
    AFHTTPClient* client = [[AFHTTPClient alloc] initWithBaseURL:webAppURL];
    
    objectManager = [[RKObjectManager alloc] initWithHTTPClient:client];
    
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

- (void) getRoomIds {
    [[RKObjectManager sharedManager] getObjectsAtPath:@"/api/room"
        parameters:nil
        success:^(RKObjectRequestOperation* operation, RKMappingResult* mappingResult) {
            NSLog(@"It was successful");
        }
        failure:^(RKObjectRequestOperation* operation, NSError *error) {
            NSLog(@"It was not successful");
        }];
}

@end