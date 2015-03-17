//
//  SecondViewController.h
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-09.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RoomCollection.h"
#import "RoomCell.h"

@interface DashboardViewController : UIViewController <UICollectionViewDataSource, UICollectionViewDelegate>

    @property (weak, nonatomic) IBOutlet UICollectionView *roomCollectionView;
    @property (weak, nonatomic) IBOutlet UIBarButtonItem *refreshButton;

@end

