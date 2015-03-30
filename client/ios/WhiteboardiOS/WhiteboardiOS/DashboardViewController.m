#import "DashboardViewController.h"

@interface DashboardViewController () {
        NSArray *roomSections;
    }

    - (void) initView;
    - (void) initRoomCollection;
    - (NSString *) getAuthToken;
    - (void) refreshRooms;
    - (void) refreshRoomsButtonClick:(id)sender;
    - (void) updateRoomList;
    - (void) createNewRoomController:(RoomModel *)roomModel;
    - (void) joinSocket:(SIOSocket *)socket forRoom:(RoomModel *)roomModel;
    - (void) setupJoinRequestListener:(SIOSocket *)socket forRoom:(RoomModel *)roomModel;
    - (void) handleFailedJoin;
    - (void) handleSuccessfulJoin:(SIOSocket *)socket forRoom:(RoomModel *)roomModel;
@end

@implementation DashboardViewController

- (void) viewDidLoad {
    [super viewDidLoad];
    
    [self initView];
    [self initRoomCollection];
}

- (void) initView {
    [[self roomCollectionView] setDataSource:self];
    [[self roomCollectionView] setDelegate:self];
    [[self refreshButton] setTarget:self];
    [[self refreshButton] setAction:@selector(refreshRoomsButtonClick:)];
}

- (void) initRoomCollection {
    AppDelegate* appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    RestkitWrapper *restkitWrapper = appDelegate.restkitWrapper;
    self.roomCollection = [[RoomCollection alloc] init:restkitWrapper];
    [self.roomCollection registerObserver:self];
}

- (void) viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
    [self refreshRooms];
}

- (void) refreshRooms {
    NSString *authToken = [self getAuthToken];
    
    [self.roomCollection fetchRooms:authToken];
}

- (NSString *) getAuthToken {
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    
    return appDelegate.userPromise.userModel.authToken;
}

- (void) didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

#pragma mark - RoomCollectionObserver
- (void) notifyOfChange {
    [self updateRoomList];
}

- (void) updateRoomList {
    NSArray *roomModels = [self.roomCollection roomModels];
    roomSections = [[NSArray alloc] initWithObjects:[roomModels mutableCopy], nil];
    [[self roomCollectionView] reloadData];
}

#pragma mark - UICollectionView Datasource
- (NSInteger) collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    NSMutableArray *roomModelArray = [roomSections objectAtIndex:section];
    return [roomModelArray count];
}

- (NSInteger) numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return [roomSections count];
}

- (UICollectionViewCell *) collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    RoomCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"RoomCell" forIndexPath:indexPath];
    NSMutableArray *roomModelArray = [roomSections objectAtIndex:indexPath.section];
    RoomModel *roomModel = [roomModelArray objectAtIndex:indexPath.row];
    
    cell.backgroundColor = [UIColor whiteColor];
    [cell.roomLabel setText:roomModel.roomId];
    
    return cell;
}

- (void) collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    NSMutableArray *roomModelArray = [roomSections objectAtIndex:indexPath.section];
    RoomModel *roomModel = [roomModelArray objectAtIndex:indexPath.row];
    
    [self createNewRoomController:roomModel];
}

- (void) createNewRoomController:(RoomModel *)roomModel {
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    
    [SocketFactory createSocket:appDelegate.webAppURI
        onSuccess:^(SIOSocket *socket) {
            [self joinSocket:socket forRoom:roomModel];
        }
        orFail:^() {
            NSLog(@"Could not create socket for room");
        }
    ];
}

- (void) joinSocket:(SIOSocket *)socket forRoom:(RoomModel *)roomModel {
    NSString *authToken = [self getAuthToken];
    [self setupJoinRequestListener:socket forRoom:roomModel];
    [socket emit:JOIN_REQUEST args:@[@{@"authToken":authToken, @"roomId":roomModel.roomId}]];
    
}

- (void) setupJoinRequestListener:(SIOSocket *)socket forRoom:(RoomModel *)roomModel {
    [socket on:JOIN_REQUEST callback:^(SIOParameterArray *args) {
        if([FAILED_JOIN isEqualToString:[args objectAtIndex:0]]) {
            [self handleFailedJoin];
        } else {
            [self handleSuccessfulJoin:socket forRoom:roomModel];
        }
    }];
}

- (void) handleFailedJoin {
    NSLog(@"Join succeeded");
}

- (void) handleSuccessfulJoin:(SIOSocket *)socket forRoom:(RoomModel *)roomModel {
    NSLog(@"Join succeeded");
    NSMutableArray *currentTabs = [NSMutableArray arrayWithArray:self.tabBarController.viewControllers];
    RoomViewController *newViewController = [RoomViewController createRoomViewController:roomModel withSocket:socket];
            
    [currentTabs addObject:newViewController];
    [self.tabBarController setViewControllers:currentTabs animated:YES];
    [newViewController setSocket:socket];
}

#pragma mark - Toolbar Button Actions
- (void) refreshRoomsButtonClick:(id)sender {
    [self refreshRooms];
}

@end
