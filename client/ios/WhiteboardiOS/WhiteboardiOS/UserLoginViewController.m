#import "UserLoginViewController.h"

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
-(void)handleAuthentication {
    //Remove Login Tab
    NSMutableArray *currentTabs = [NSMutableArray arrayWithArray:self.tabBarController.viewControllers];
    [currentTabs removeObject:self];
    [self.tabBarController setViewControllers:currentTabs animated:YES];
    //Goto dashboard
    self.tabBarController.selectedIndex = 0;

}
- (IBAction)loginBtn:(id)sender {
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    UserSession* userSession = appDelegate.userSession;
    NSString* login = self.usernameTxt.text;
    NSString* password = self.passwordTxt.text;
    
    self.statusLabel.text = @"";
    [userSession authUser:login
                 password:password
                       cb: ^(NSString* error){
                           if (error) {
                               self.statusLabel.text = error;
                            }else{
                                [self handleAuthentication];
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
                       cb: ^(NSString* error){
                           if (error) {
                               self.statusLabel.text = error;
                           }else{
                               [self handleAuthentication];
                           }
                       }];
}



@end
