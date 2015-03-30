#import "RoomViewController.h"

@interface RoomViewController () {
        RoomManager *roomManager;
        RoomModel *roomModel;
        DrawLogic *drawLogic;
    }

    - (void) initializeController:(RoomModel *)roomInfo withSocket:(SIOSocket *)socket;
    - (void) initializeListeners;
    - (void) setupGetAllDrawCommandsListener;
    - (void) setupDrawCommandListener;
    - (void) handleDrawCommand:(NSArray *)drawCommands;
    - (void) getCurrentRoomState;
    - (void) leaveButtonClick:(id)sender;
    - (void) removeControllerTab;
@end

@implementation RoomViewController

+ (RoomViewController *) createRoomViewController:(RoomModel *)roomToCreate withSocket:(SIOSocket *) socket {
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle: nil];
    RoomViewController *newRoomController = [storyboard instantiateViewControllerWithIdentifier:@"RoomViewController"];
    
    [newRoomController initializeController:roomToCreate withSocket:socket];
    [roomToCreate setSocket:socket];
    [roomToCreate setRoomView:newRoomController];
    
    return newRoomController;
}

- (void) initializeController:(RoomModel *)roomInfo withSocket:(SIOSocket *)socket {
    NSString *roomTitle = roomInfo.name;
    UIImage *viewTabIcon = [UIImage imageNamed:@"Crayon-icon.png"];
    UITabBarItem *viewTabBarItem = [[UITabBarItem alloc] initWithTitle:roomTitle image:viewTabIcon tag:0];
    
    [self setTabBarItem:viewTabBarItem];
    [self setSocket:socket];
    roomModel = roomInfo;
}

- (void) viewDidLoad {
    [super viewDidLoad];
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    
    drawLogic = [[DrawLogic alloc] initWithDrawCanvas:self.whiteboardCanvas andTempCanvas:self.tempDrawCanvas];
    self.drawToolModel = [[DrawToolModel alloc] init];
    roomManager = appDelegate.roomManager;
    
    [self.leaveButton setAction:@selector(leaveButtonClick:)];
    [self.roomTitleLabel setText:[NSString stringWithFormat:@"Room: %@", roomModel.name]];
    
    [self initializeListeners];
    [self getCurrentRoomState];
}

- (void) initializeListeners {
    [self setupGetAllDrawCommandsListener];
    [self setupDrawCommandListener];
}

- (void) setupGetAllDrawCommandsListener {
    [self.socket on:GET_ALL_DRAW_COMMANDS callback:^(SIOParameterArray *args) {
        NSArray *drawCommands = [[args objectAtIndex:0] objectForKey:DRAW_COMMANDS_KEY];
        if(drawCommands) {
            [self handleDrawCommand:drawCommands];
        }
    }];
}

- (void) setupDrawCommandListener {
    [self.socket on:DRAW_COMMAND callback:^(SIOParameterArray *args) {
        [self handleDrawCommand:@[[[args objectAtIndex:0] objectForKey:DRAW_COMMAND]]];
    }];
}

- (void) handleDrawCommand:(NSArray *)drawCommands {
    NSMutableArray *drawModels = [[NSMutableArray alloc] init];
    for(id drawCommand in drawCommands) {
        DrawToolModel *newDrawToolModel = [DrawLogic createDrawToolModel:[drawCommand objectForKey:TOOL_KEY]];
        DrawModel *newDrawModel = [DrawLogic createDrawModel:newDrawToolModel withCoordinates:[drawCommand objectForKey:VERTICES_KEY]];
                
        [drawModels addObject:newDrawModel];
    }
            
    [drawLogic drawDrawCommands:drawModels];
}

- (void) getCurrentRoomState {
    [self.socket emit:GET_ALL_DRAW_COMMANDS];
}

- (void) touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [touches anyObject];
    CGPoint startPoint = [touch locationInView:self.whiteboardCanvas];
    
    [drawLogic startDrawing:self.drawToolModel atPoint:startPoint];
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
    
    // Due to a bug in OCMock the socket emit call cannot be unit tested, so in order to unit test this method
    // the socket emit call has to be wrapped in this if statement
    if(drawModel) {
        [self.socket emit:DRAW_COMMAND args:@[[drawModel toDrawMessage:roomModel.roomId]]];
    }
}

- (void) leaveButtonClick:(id)sender {
    [roomManager closeRoom:roomModel.roomId];
    
    [self removeControllerTab];
    self.tabBarController.selectedViewController = [self.tabBarController.viewControllers objectAtIndex:0];
}

- (void) removeControllerTab {
    NSArray *currentTabs = self.tabBarController.viewControllers;
    NSMutableArray *newTabs = [[NSMutableArray alloc] init];
    
    for(id tab in currentTabs) {
        if (tab != self) {
            [newTabs addObject:tab];
        }
    }
    
    [self.tabBarController setViewControllers:newTabs animated:YES];
}

@end
