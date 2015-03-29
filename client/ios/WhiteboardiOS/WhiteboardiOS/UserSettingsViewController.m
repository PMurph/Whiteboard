#import "UserSettingsViewController.h"
#import "UserModel.h"

@interface UserSettingsViewController ()

@end

@implementation UserSettingsViewController


+ (UserSettingsViewController*)initWithUser:(UserModel*)user {
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle: nil];
    UserSettingsViewController *newView = [storyboard instantiateViewControllerWithIdentifier:@"UserSettingsViewController"];
    UIImage *viewTabIcon = [UIImage imageNamed:@"settings.png"];
    UITabBarItem *viewTabBarItem = [[UITabBarItem alloc] initWithTitle:@"Settings" image:viewTabIcon tag:0];
    
    [newView setTabBarItem:viewTabBarItem];
    
    return newView;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (IBAction)saveClick:(id)sender {
}

@end
