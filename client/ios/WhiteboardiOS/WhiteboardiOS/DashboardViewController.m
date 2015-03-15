//
//  SecondViewController.m
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-09.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "DashboardViewController.h"

@interface DashboardViewController () <UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>

@end

@implementation DashboardViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    roomCollection = [[RoomCollection alloc] init];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
