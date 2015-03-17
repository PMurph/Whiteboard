#import <UIKit/UIKit.h>

#import "AppDelegate.h"
#import "RoomCell.h"
#import "RoomCollection.h"
#import "RoomCollectionObserver.h"

@interface DashboardViewController : UIViewController <UICollectionViewDataSource, UICollectionViewDelegate, RoomCollectionObserver>

    @property (weak, nonatomic) IBOutlet UICollectionView *roomCollectionView;
    @property (weak, nonatomic) IBOutlet UIBarButtonItem *refreshButton;

@end

