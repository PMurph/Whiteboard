#import "UserLoginViewController.h"
#import "UserSettingsViewController.h"

@interface UserLoginViewController ()

@end

@implementation UserLoginViewController

+ (UserLoginViewController*)init {
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle: nil];
    UserLoginViewController *newView = [storyboard instantiateViewControllerWithIdentifier:@"UserLoginViewController"];
    UIImage *viewTabIcon = [UIImage imageNamed:@"login.png"];
    UITabBarItem *viewTabBarItem = [[UITabBarItem alloc] initWithTitle:@"Login" image:viewTabIcon tag:0];
    
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

-(void) swapWithUserSettings:(UserModel*)user {
    NSMutableArray *currentTabs = [NSMutableArray arrayWithArray:self.tabBarController.viewControllers];
    UserSettingsViewController* userSettingsView = [UserSettingsViewController initWithUser:user];
    [currentTabs replaceObjectAtIndex:1 withObject:userSettingsView];
    [self.tabBarController setViewControllers:currentTabs animated:YES];
}
-(void)handleAuthentication:(UserModel*)user {
    //Goto dashboard
    self.tabBarController.selectedIndex = 0;
    //Remove Login Tab
    [self swapWithUserSettings:user];

}
- (IBAction)loginBtn:(id)sender {
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    UserSession* userSession = appDelegate.userSession;
    NSString* login = self.usernameTxt.text;
    NSString* password = self.passwordTxt.text;
    
    self.statusLabel.text = @"";
    [userSession authUser:login
                 password:password
                       cb: ^(NSString* error, UserModel* user){
                           if (error || !user) {
                               self.statusLabel.text = error;
                            }else{
                                [self handleAuthentication:user];
                           }
                       }];
}
- (IBAction)registerBtn:(id)sender {
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    UserSession* userSession = appDelegate.userSession;
    NSString* login = self.usernameTxt.text;
    NSString* password = self.passwordTxt.text;
    
    self.statusLabel.text = @"";
    [userSession registerUser:login
                 password:password
                       cb: ^(NSString* error, UserModel* user){
                           if (error || !user) {
                               self.statusLabel.text = error;
                           }else{
                               [self handleAuthentication:user];
                           }
                       }];
}



@end
