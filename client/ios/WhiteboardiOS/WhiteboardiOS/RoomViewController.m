#import "RoomViewController.h"

@interface RoomViewController () {
        RoomModel *roomModel;
        DrawLogic *drawLogic;
        DrawToolModel *drawToolModel;
    }

    - (void) initializeController:(RoomModel *)roomInfo withSocket:(SIOSocket *)socket;
    - (void) getCurrentRoomState;
    - (void) setupGetAllDrawCommandsListener;
    - (void) setupDrawCommandListener;
    - (void) handleDrawCommand:(NSDictionary *)drawCommand;
@end

@implementation RoomViewController

+ (RoomViewController *)createRoomViewController:(RoomModel *)roomToCreate withSocket:(SIOSocket *) socket {
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle: nil];
    RoomViewController *newRoomController = [storyboard instantiateViewControllerWithIdentifier:@"RoomViewController"];
    
    [newRoomController initializeController:roomToCreate withSocket:socket];
    
    return newRoomController;
}

- (void) initializeController:(RoomModel *)roomInfo withSocket:(SIOSocket *)socket {
    NSString *roomTitle = [NSString stringWithFormat:@"Room %@", roomInfo.roomId];
    UIImage *viewTabIcon = [UIImage imageNamed:@"Crayon-icon.png"];
    UITabBarItem *viewTabBarItem = [[UITabBarItem alloc] initWithTitle:roomTitle image:viewTabIcon tag:0];
    
    [self setTabBarItem:viewTabBarItem];
    [self setSocket:socket];
    roomModel = roomInfo;
}

- (void) viewDidLoad {
    [super viewDidLoad];
    
    drawLogic = [[DrawLogic alloc] initWithDrawCanvas:self.whiteboardCanvas andTempCanvas:self.tempDrawCanvas];
    [[self roomTitleLabel] setText:[NSString stringWithFormat:@"Room %@", roomModel.roomId]];
    drawToolModel = [[DrawToolModel alloc] init];
    [self getCurrentRoomState];
}

- (void) getCurrentRoomState {
    [self setupGetAllDrawCommandsListener];
    [self setupDrawCommandListener];
    [self.socket emit:GET_ALL_DRAW_COMMANDS];
}

- (void) setupGetAllDrawCommandsListener {
    [self.socket on:GET_ALL_DRAW_COMMANDS callback:^(SIOParameterArray *args) {
        NSArray *drawCommands = [[args objectAtIndex:0] objectForKey:DRAW_COMMANDS_KEY];
        if(drawCommands) {
            for(id drawCommand in drawCommands) {
                NSLog(@"Draw Command %@", drawCommand);
                [self handleDrawCommand:[drawCommand objectForKey:DRAW_MESSAGE_KEY]];
            }
        }
    }];
}

- (void) setupDrawCommandListener {
    [self.socket on:DRAW_COMMAND callback:^(SIOParameterArray *args) {
        NSLog(@"Draw Command %@", [args objectAtIndex:0]);
    }];
}

- (void) handleDrawCommand:(NSDictionary *)drawCommand {
    //NSDictionary *drawTool = [drawCommand objectForKey:TOOL_KEY];
    
}

- (void) didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void) touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [touches anyObject];
    CGPoint startPoint = [touch locationInView:self.whiteboardCanvas];
    
    [drawLogic startDrawing:drawToolModel atPoint:startPoint];
}

- (void) touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [touches anyObject];
    CGPoint currentPoint = [touch locationInView:self.whiteboardCanvas];
    
    [drawLogic updateDrawing:currentPoint];
}

- (void) touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [touches anyObject];
    CGPoint currentPoint = [touch locationInView:self.whiteboardCanvas];
    
    DrawModel *drawModel = [drawLogic endDrawing:currentPoint];
    
    [self.socket emit:DRAW_COMMAND args:@[[drawModel toDrawMessage:roomModel.roomId]]];
}

@end
