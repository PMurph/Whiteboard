#pragma once

#import <UIKit/UIKit.h>

#import "AppDelegate.h"
#import "RestkitWrapper.h"
@interface UserLoginViewController : UIViewController

@property (weak, nonatomic) IBOutlet UITextField *usernameTxt;
@property (weak, nonatomic) IBOutlet UITextField *passwordTxt;
@property (weak, nonatomic) IBOutlet UILabel *statusLabel;
+ (UserLoginViewController*)init;
@end

