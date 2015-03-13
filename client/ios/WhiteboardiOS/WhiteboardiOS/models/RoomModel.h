//
//  RoomModel.h
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-12.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#ifndef WhiteboardiOS_RoomModel_h
#define WhiteboardiOS_RoomModel_h

#include <RestKit/RestKit.h>
#include <RestKit/CoreData.h>

@interface RoomModel : NSManagedObject
    @property (nonatomic, copy) NSString* roomId;
@end


#endif
