#import "RoomViewController.h"

@interface RoomViewController ()

@end

@implementation RoomViewController

+ (RoomViewController *)createRoomViewController:(RoomModel *)roomToCreate {
    UIImage *viewTabIcon = [UIImage imageNamed:@"Crayon-icon.png"];
    UITabBarItem *viewTabBarItem = [[UITabBarItem alloc] initWithTitle:roomToCreate.roomId image:viewTabIcon tag:0];
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle: nil];
    RoomViewController *newRoomController = [storyboard instantiateViewControllerWithIdentifier:@"RoomViewController"];
    [newRoomController setTabBarItem:viewTabBarItem];
    
    return newRoomController;
}

- (void)viewDidLoad {
    [super viewDidLoad];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

@end
