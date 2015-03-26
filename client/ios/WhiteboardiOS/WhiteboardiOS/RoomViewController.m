#import "RoomViewController.h"

@interface RoomViewController () {
        BOOL drawing;
        RoomModel *roomModel;
        CGPoint lastPoint;
    }

    - (void) initializeController:(RoomModel *)roomInfo withSocket:(SIOSocket *)socket;
    - (void) getCurrentRoomState;
    - (void) setupGetAllDrawCommandsListener;
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
    [[self roomTitleLabel] setText:[NSString stringWithFormat:@"Room %@", roomModel.roomId]];
    drawing = NO;
}

- (void) getCurrentRoomState {
    [self setupGetAllDrawCommandsListener];
}

- (void) setupGetAllDrawCommandsListener {
    [self.socket on:GET_ALL_DRAW_COMMANDS callback:^(SIOParameterArray * args) {
        if([args objectAtIndex:0]) {
        }
    }];
}

- (void) didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void) touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    drawing = NO;
    UITouch *touch = [touches anyObject];
    lastPoint = [touch locationInView:self.whiteboardCanvas];
    NSLog(@"Start Drawing");
}

- (void) touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    drawing = YES;
    UITouch *touch = [touches anyObject];
    CGPoint currentPoint = [touch locationInView:self.whiteboardCanvas];
    NSLog(@"Point x:%f y:%f", currentPoint.x, currentPoint.y);
    
    UIGraphicsBeginImageContext(self.whiteboardCanvas.frame.size);
    [self.tempDrawCanvas.image drawInRect:CGRectMake(0, 0, self.whiteboardCanvas.frame.size.width, self.whiteboardCanvas.frame.size.height)];
    CGContextMoveToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
    CGContextAddLineToPoint(UIGraphicsGetCurrentContext(), currentPoint.x, currentPoint.y);
    CGContextSetLineCap(UIGraphicsGetCurrentContext(), kCGLineCapRound);
    CGContextSetLineWidth(UIGraphicsGetCurrentContext(), 10.0);
    CGContextSetRGBStrokeColor(UIGraphicsGetCurrentContext(), 0.0, 0.0, 0.0, 1.0);
    CGContextSetBlendMode(UIGraphicsGetCurrentContext(), kCGBlendModeNormal);
    
    CGContextStrokePath(UIGraphicsGetCurrentContext());
    self.tempDrawCanvas.image = UIGraphicsGetImageFromCurrentImageContext();
    [self.tempDrawCanvas setAlpha:1.0];
    UIGraphicsEndImageContext();
    
    lastPoint = currentPoint;
}

- (void) touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
    if (!drawing) {
        UIGraphicsBeginImageContext(self.whiteboardCanvas.frame.size);
        [self.tempDrawCanvas.image drawInRect:CGRectMake(0, 0, self.whiteboardCanvas.frame.size.width, self.whiteboardCanvas.frame.size.height)];
        CGContextSetLineCap(UIGraphicsGetCurrentContext(), kCGLineCapRound);
        CGContextSetLineWidth(UIGraphicsGetCurrentContext(), 10.0);
        CGContextSetRGBStrokeColor(UIGraphicsGetCurrentContext(), 1.0, 1.0, 1.0, 1.0);
        CGContextMoveToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
        CGContextAddLineToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
        CGContextStrokePath(UIGraphicsGetCurrentContext());
        CGContextFlush(UIGraphicsGetCurrentContext());
        self.tempDrawCanvas.image = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
    }
    
    UIGraphicsBeginImageContext(self.whiteboardCanvas.frame.size);
    [self.whiteboardCanvas.image drawInRect:CGRectMake(0, 0, self.whiteboardCanvas.frame.size.width, self.whiteboardCanvas.frame.size.height) blendMode:kCGBlendModeNormal alpha:1.0];
    [self.tempDrawCanvas.image drawInRect:CGRectMake(0, 0, self.whiteboardCanvas.frame.size.width, self.whiteboardCanvas.frame.size.height) blendMode:kCGBlendModeNormal alpha:1.0];
    self.whiteboardCanvas.image = UIGraphicsGetImageFromCurrentImageContext();
    self.tempDrawCanvas.image = nil;
    UIGraphicsEndImageContext();
    NSLog(@"End Drawing");
}

@end
