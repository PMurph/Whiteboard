#import <UIKit/UIKit.h>

#import "RestkitWrapper.h"
#import "UserPromise.h"
#import "RoomManager.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic, readwrite) RestkitWrapper *restkitWrapper;
@property (strong, readonly) NSString *webAppURI;
@property (strong, readwrite) UserPromise *userPromise;
@property (strong, readonly) RoomManager *roomManager;

@end

