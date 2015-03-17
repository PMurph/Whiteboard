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
        RoomCollection *roomCollection;
    }

    - (void)initView;
    - (void)initRoomCollection;
    - (void)refreshRooms:(id)sender;
    - (void)updateRoomList;
@end

@implementation DashboardViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self initView];
    [self initRoomCollection];
}

- (void)initView {
    [[self roomCollectionView]setDataSource:self];
    [[self roomCollectionView]setDelegate:self];
    [[self refreshButton]setTarget:self];
    [[self refreshButton]setAction:@selector(refreshRooms:)];
}

- (void)initRoomCollection {
    AppDelegate* appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    RestkitWrapper *restkitWrapper = appDelegate.restkitWrapper;
    roomCollection = [[RoomCollection alloc] init:restkitWrapper];
    [roomCollection registerObserver:self];
}

- (void) viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [roomCollection fetchRooms];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

#pragma mark - RoomCollectionObserver

- (void) notifyOfChange {
    [self updateRoomList];
}

- (void)updateRoomList {
    NSArray *roomModels = [roomCollection roomModels];
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
    [roomCollection fetchRooms];
}

@end
