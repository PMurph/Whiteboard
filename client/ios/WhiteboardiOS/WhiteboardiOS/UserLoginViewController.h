#pragma once

#import <UIKit/UIKit.h>

#import "AppDelegate.h"
#import "RestkitWrapper.h"
#import "RoomManager.h"
@interface UserLoginViewController : UIViewController

@property (weak, nonatomic) IBOutlet UITextField *usernameTxt;
@property (weak, nonatomic) IBOutlet UITextField *passwordTxt;
@property (weak, nonatomic) IBOutlet UILabel *statusLabel;
@property (strong, nonatomic, readwrite) RoomManager* roomManager;
+ (UserLoginViewController*)init;

@end

