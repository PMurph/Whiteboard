#import <UIKit/UIKit.h>

#import "AppDelegate.h"
#import "RoomCell.h"
#import "RoomCollection.h"
#import "RoomCollectionObserver.h"
#import "RoomViewController.h"

@interface DashboardViewController : UIViewController <UICollectionViewDataSource, UICollectionViewDelegate, RoomCollectionObserver>

    @property (weak, nonatomic) IBOutlet UICollectionView *roomCollectionView;
    @property (weak, nonatomic) IBOutlet UIBarButtonItem *refreshButton;
    @property (strong, nonatomic, readwrite) RoomCollection *roomCollection;

@end

