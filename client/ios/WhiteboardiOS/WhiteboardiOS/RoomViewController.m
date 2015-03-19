#import "RoomViewController.h"

@interface RoomViewController () {
    BOOL drawing;
}

@end

@implementation RoomViewController

+ (RoomViewController *)createRoomViewController:(RoomModel *)roomToCreate {
    NSString *roomTitle = [NSString stringWithFormat:@"Room %@", roomToCreate.roomId];
    UIImage *viewTabIcon = [UIImage imageNamed:@"Crayon-icon.png"];
    UITabBarItem *viewTabBarItem = [[UITabBarItem alloc] initWithTitle:roomTitle image:viewTabIcon tag:0];
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle: nil];
    RoomViewController *newRoomController = [storyboard instantiateViewControllerWithIdentifier:@"RoomViewController"];
    
    [newRoomController setTabBarItem:viewTabBarItem];
    [newRoomController setRoomModel:roomToCreate];
    
    return newRoomController;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    [[self roomTitleLabel] setText:[NSString stringWithFormat:@"Room %@", [[self roomModel] roomId]]];
    drawing = NO;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    drawing = YES;
    NSLog(@"Start Drawing");
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    if(drawing) {
        NSLog(@"Drawing...");
    }
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
    drawing = NO;
    NSLog(@"End Drawing");
}

@end
