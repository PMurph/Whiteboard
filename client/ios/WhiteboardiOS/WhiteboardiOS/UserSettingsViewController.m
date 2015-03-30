#import "UserSettingsViewController.h"
#import "UserLoginViewController.h"
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
    newView.user = user;
    return newView;
}

-(void) swapWithUserLogin:(UITabBarController*)tabBar {
    NSMutableArray *currentTabs = [NSMutableArray arrayWithArray:tabBar.viewControllers];
    UserLoginViewController* userLoginView = [UserLoginViewController init];
    [currentTabs replaceObjectAtIndex:1 withObject:userLoginView];
    [tabBar setViewControllers:currentTabs animated:YES];
}

-(void)setLabels {
    self.displayNameLabel.text = [NSString stringWithFormat:@"%@ %@", @"Display Name:", self.user.displayName];
    self.usernameLabel.text = [NSString stringWithFormat:@"%@ %@", @"Username:", self.user.login];
}
- (void)viewDidLoad {
    [super viewDidLoad];
    AppDelegate* appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    self.userSession = appDelegate.userSession;
    
    [self setLabels];


}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (void)setStatus:(NSString*)message isError:(bool)isError {
    self.statusLabel.text = message;
    if(isError){
        [self.statusLabel setTextColor:[UIColor redColor]];
    }else{
        [self.statusLabel setTextColor:[UIColor blackColor]];
    }
}

- (IBAction)saveClick:(id)sender {
    bool change = NO;
    NSString* newDisplayName = self.displayNameTxt.text;
    NSString* newUsername = self.usernameTxt.text;
    NSString* password1 = self.password1Txt.text;
    NSString* password2 = self.password2Txt.text;
    
    if(newDisplayName.length > 0){
        self.user.displayName = newDisplayName;
        change = YES;
    }
    if(newUsername.length > 0){
        self.user.login = newUsername;
        change = YES;
    }
    if(password1.length > 0 || password2.length > 0){
        if([password1 isEqualToString:password2]){
            self.user.password = password1;
            change = YES;
        }else{
            [self setStatus:@"Passwords do not match" isError:YES];
            return;
        }
    }
    
    if(change){
        [self.userSession save:self.user cb:^(NSString* error, UserModel* user){
            if(error || !user) {
                NSString* errorMsg = (error) ? error : @"No user model returned";
                [self setStatus:[NSString stringWithFormat:@"Invalid: %@", errorMsg] isError:YES];
            }else{
                [self setStatus:@"Save Successful" isError:NO];
                self.displayNameTxt.text = @"";
                self.usernameTxt.text = @"";
                self.password1Txt.text = @"";
                self.password2Txt.text = @"";
                [self setLabels];
            }
        }];
    }
}

@end
