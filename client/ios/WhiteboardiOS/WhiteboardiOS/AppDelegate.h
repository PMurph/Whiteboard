#pragma once
#import <UIKit/UIKit.h>

#import "RestkitWrapper.h"
#import "UserSession.h"
#import "RoomManager.h"
#import "UserSession.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (nonatomic, readwrite) RestkitWrapper *restkitWrapper;
@property (strong, readonly) NSString *webAppURI;
@property (strong, readwrite) UserSession *userSession;
@property (strong, readonly) RoomManager *roomManager;

@end

