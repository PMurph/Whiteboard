#ifndef WhiteboardiOS_RoomViewController_h
#define WhiteboardiOS_RoomViewController_h

#import <UIKit/UIKit.h>
#import <SIOSocket/SIOSocket.h>

#import "AppDelegate.h"
#import "RoomModel.h"

@interface RoomViewController : UIViewController
    
    @property (weak, nonatomic) IBOutlet UILabel *roomTitleLabel;
    @property (strong, nonatomic) RoomModel *roomModel;
    @property (strong, nonatomic) SIOSocket *socketIO;
    @property (weak, nonatomic) IBOutlet UIImageView *whiteboardCanvas;
    @property (weak, nonatomic) IBOutlet UIImageView *tempDrawCanvas;
    
    + (RoomViewController *)createRoomViewController:(RoomModel *)roomToCreate;

@end

#endif
