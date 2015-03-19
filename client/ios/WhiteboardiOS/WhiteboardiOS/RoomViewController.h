#ifndef WhiteboardiOS_RoomViewController_h
#define WhiteboardiOS_RoomViewController_h

#import <UIKit/UIKit.h>

#import "RoomModel.h"

@interface RoomViewController : UIViewController
    + (RoomViewController *)createRoomViewController:(RoomModel *)roomToCreate;
@end

#endif
