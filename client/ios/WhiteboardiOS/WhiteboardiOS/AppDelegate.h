#import <UIKit/UIKit.h>
#import "RestkitWrapper.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic, readwrite) RestkitWrapper *restkitWrapper;
@property (strong, readonly) NSString *webAppURI;

@end

