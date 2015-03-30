#import <UIKit/UIKit.h>

#import "AppDelegate.h"
#import "RoomCell.h"
#import "RoomCollection.h"
#import "RoomCollectionObserver.h"
#import "RoomViewController.h"
#import "RoomManager.h"
#import "SocketFactory.h"

#define JOIN_REQUEST @"joinRequest"
#define FAILED_JOIN @"rejected"

@interface DashboardViewController : UIViewController <UICollectionViewDataSource, UICollectionViewDelegate, RoomCollectionObserver>
@property (strong, nonatomic) IBOutlet UIBarButtonItem *LogoutBtn;

@property (strong, nonatomic) IBOutlet UIToolbar *toolbar;
    @property (weak, nonatomic) IBOutlet UICollectionView *roomCollectionView;
    @property (weak, nonatomic) IBOutlet UIBarButtonItem *refreshButton;
@property (strong, nonatomic, readwrite) RoomCollection *roomCollection;
@property (strong, nonatomic, readwrite) RoomManager* roomManager;
@property (weak, nonatomic) IBOutlet UIActivityIndicatorView *spinner;
@property (nonatomic, readwrite) UserSession* userSession;
@end

