#pragma once

#import <UIKit/UIKit.h>

#import "AppDelegate.h"
#import "RestkitWrapper.h"
#include "UserModel.h"


@interface UserSettingsViewController : UIViewController
@property (weak, nonatomic) UserSession* userSession;
@property (weak, nonatomic) IBOutlet UITextField *displayNameTxt;
@property (weak, nonatomic) IBOutlet UILabel *displayNameLabel;
@property (weak, nonatomic) IBOutlet UILabel *usernameLabel;
@property (weak, nonatomic) IBOutlet UITextField *usernameTxt;
@property (weak, nonatomic) IBOutlet UILabel *passwordLabel;
@property (weak, nonatomic) IBOutlet UITextField *password1Txt;
@property (weak, nonatomic) IBOutlet UITextField *password2Txt;
@property (weak, nonatomic) IBOutlet UIButton *saveBtn;
@property (weak, nonatomic) IBOutlet UILabel *statusLabel;
@property (weak, nonatomic, readwrite) UserModel* user;
+ (UserSettingsViewController*)initWithUser:(UserModel*)user;

@end

