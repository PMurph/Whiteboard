//
//  SecondViewController.m
//  WhiteboardiOS
//
//  Created by Patrick Murphy on 2015-03-09.
//  Copyright (c) 2015 Patrick Murphy. All rights reserved.
//

#import "DashboardViewController.h"

@interface DashboardViewController () {
        NSArray *roomSections;
        RestkitWrapper *restkitWrapper;
        RoomCollection *roomCollection;
    }

    - (void)refreshRooms:(id)sender;
    - (void)updateRoomList;
@end

@implementation DashboardViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [[self roomCollectionView]setDataSource:self];
    [[self roomCollectionView]setDelegate:self];
    [[self refreshButton]setTarget:self];
    [[self refreshButton]setAction:@selector(refreshRooms:)];
    
    restkitWrapper = [[RestkitWrapper alloc] init:@"http://ec2-54-68-246-235.us-west-2.compute.amazonaws.com"];
    roomCollection = [[RoomCollection alloc] init:restkitWrapper];
    [roomCollection refreshRoomIds];
}

- (void) viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self updateRoomList];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)updateRoomList {
    [roomCollection refreshRoomIds];
    NSArray *roomModels = [roomCollection getRoomIds];
    roomSections = [[NSArray alloc] initWithObjects:[roomModels mutableCopy], nil];
    [[self roomCollectionView] reloadData];
}

#pragma mark - UICollectionView Datasource
- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    NSMutableArray *roomModelArray = [roomSections objectAtIndex:section];
    return [roomModelArray count];
}

- (NSInteger) numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return [roomSections count];
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    RoomCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"RoomCell" forIndexPath:indexPath];
    NSMutableArray *roomModelArray = [roomSections objectAtIndex:indexPath.section];
    NSString *roomId = [[roomModelArray objectAtIndex:indexPath.row] roomId];
    cell.backgroundColor = [UIColor whiteColor];
    [cell.roomLabel setText:roomId];
    return cell;
}

#pragma mark - Toolbar Button Actions
- (void)refreshRooms:(id)sender {
    [self updateRoomList];
}

@end
