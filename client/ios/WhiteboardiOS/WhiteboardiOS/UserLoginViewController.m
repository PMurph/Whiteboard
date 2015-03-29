#import "UserLoginViewController.h"
#import "UserSettingsViewController.h"

@interface UserLoginViewController ()

@end

@implementation UserLoginViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
-(void)handleAuthentication:(UserModel*)user {
    //Goto dashboard
    self.tabBarController.selectedIndex = 0;
    //Remove Login Tab
    NSMutableArray *currentTabs = [NSMutableArray arrayWithArray:self.tabBarController.viewControllers];
    UserSettingsViewController* userSettingsView = [UserSettingsViewController initWithUser:user];
    [currentTabs replaceObjectAtIndex:1 withObject:userSettingsView];
    [self.tabBarController setViewControllers:currentTabs animated:YES];

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
