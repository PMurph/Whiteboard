#ifndef WhiteboardiOS_RoomViewController_h
#define WhiteboardiOS_RoomViewController_h

#import <UIKit/UIKit.h>

#import "RoomModel.h"

@interface RoomViewController : UIViewController
    
    @property (weak, nonatomic) IBOutlet UILabel *roomTitleLabel;
    @property (strong, nonatomic) RoomModel *roomModel;
    
    + (RoomViewController *)createRoomViewController:(RoomModel *)roomToCreate;
@end

#endif
