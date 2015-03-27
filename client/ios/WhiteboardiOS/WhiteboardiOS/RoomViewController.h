#ifndef WhiteboardiOS_RoomViewController_h
#define WhiteboardiOS_RoomViewController_h

#import <UIKit/UIKit.h>
#import <SIOSocket/SIOSocket.h>

#import "AppDelegate.h"
#import "RoomModel.h"
#import "DrawLogic.h"

#define GET_ALL_DRAW_COMMANDS @"getAllDrawCommands"
#define DRAW_COMMAND_KEY @"drawCommands"
#define MESSAGE_KEY @"message"
#define TOOL_KEY @"tool"
#define VERTICES_KEY @"vertices"

@interface RoomViewController : UIViewController
    
    @property (weak, nonatomic) IBOutlet UILabel *roomTitleLabel;
    @property (strong, nonatomic) SIOSocket *socket;
    @property (weak, nonatomic) IBOutlet UIImageView *whiteboardCanvas;
    @property (weak, nonatomic) IBOutlet UIImageView *tempDrawCanvas;

    + (RoomViewController *)createRoomViewController:(RoomModel *)roomToCreate withSocket:(SIOSocket *)socket;

@end

#endif
