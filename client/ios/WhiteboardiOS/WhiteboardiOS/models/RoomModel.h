//
//  RoomModel.h
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-12.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#ifndef WhiteboardiOS_RoomModel_h
#define WhiteboardiOS_RoomModel_h

#import <RestKit/RestKit.h>
#import <RestKit/CoreData.h>

@interface RoomModel : NSObject
    @property (nonatomic, copy) NSString* roomId;

    - (id) init:(NSString *)assignedRoomId;
@end


#endif
