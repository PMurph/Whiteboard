//
//  SecondViewController.h
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-09.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RoomCollection.h"

@interface DashboardViewController : UIViewController {
        RoomCollection* roomCollection;
    }

    @property (weak, nonatomic) IBOutlet UICollectionView *roomCollectionView;

@end

