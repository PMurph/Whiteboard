#ifndef WhiteboardiOS_RoomViewController_h
#define WhiteboardiOS_RoomViewController_h

#import <UIKit/UIKit.h>
#import <SIOSocket/SIOSocket.h>

#import "AppDelegate.h"
#import "RoomModel.h"
#import "DrawLogic.h"

#define GET_ALL_DRAW_COMMANDS @"getAllDrawCommands"
#define DRAW_COMMANDS_KEY @"drawCommands"
#define DRAW_COMMAND @"drawCommand"
#define ROOM_ID_KEY @"roomID"
#define LEAVE_ROOM_EVENT @"leaveRoom"

@interface RoomViewController : UIViewController
    
    @property (weak, nonatomic) IBOutlet UIBarButtonItem *leaveButton;
    @property (weak, nonatomic) IBOutlet UILabel *roomTitleLabel;
    @property (strong, nonatomic) SIOSocket *socket;
    @property (weak, nonatomic) IBOutlet UIImageView *whiteboardCanvas;
    @property (weak, nonatomic) IBOutlet UIImageView *tempDrawCanvas;
    @property (strong, nonatomic) DrawToolModel *drawToolModel;

    + (RoomViewController *)createRoomViewController:(RoomModel *)roomToCreate withSocket:(SIOSocket *)socket;

@end

#endif
