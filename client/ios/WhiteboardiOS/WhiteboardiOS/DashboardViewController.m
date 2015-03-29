#import "DashboardViewController.h"

@interface DashboardViewController () {
        NSArray *roomSections;
        RoomManager *roomManager;
    }

    - (void) initView;
    - (void) initRoomCollection:(AppDelegate *)appDelegate;
    - (void) initRoomManager:(AppDelegate *)appDelegate;
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
    AppDelegate* appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    self.userSession = appDelegate.userSession;
    
    [self initView];
    [self initRoomCollection:appDelegate];
    [self initRoomManager:appDelegate];
}

- (void) initView {
    [[self roomCollectionView] setDataSource:self];
    [[self roomCollectionView] setDelegate:self];
    [[self refreshButton] setTarget:self];
    [[self refreshButton] setAction:@selector(refreshRoomsButtonClick:)];
}

- (void) initRoomCollection:(AppDelegate *)appDelegate {
    RestkitWrapper *restkitWrapper = appDelegate.restkitWrapper;
    self.roomCollection = [[RoomCollection alloc] init:restkitWrapper];
    [self.roomCollection registerObserver:self];
}

- (void) initRoomManager:(AppDelegate *)appDelegate {
    roomManager = appDelegate.roomManager;
}

- (void) showSpinner {
    [self.spinner setActivityIndicatorViewStyle:UIActivityIndicatorViewStyleWhiteLarge];
    [self.spinner startAnimating];
    
}

- (void) hideSpinner {
    [self.spinner setHidesWhenStopped:YES];
    [self.spinner stopAnimating];
    
}

- (void) viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    NSString *authToken = [self getAuthToken];

    
    if (authToken) {
        [self refreshRooms];
    }else{
        [self.userSession addAuthCB:^(){
            NSLog(@"authenticateddddd!!!");
            [self refreshRooms];
        }];
        [self showSpinner];
    }
}

- (void) refreshRooms {
    NSString *authToken = [self getAuthToken];
    
    if (authToken) {
        [self.roomCollection fetchRooms:authToken cb:^(){
            [self hideSpinner];
        }];
    }else{
        UIAlertView* errorView = [[UIAlertView alloc]
                                  initWithTitle: @"Error"
                                  message:@"The app is not authenticated"
                                  delegate:nil
                                  cancelButtonTitle: @"OK"
                                  otherButtonTitles: nil];
        [errorView show];
    }
}

- (NSString *) getAuthToken {
    UserModel* user = self.userSession.currentUser;
    
    if (user) {
        return user.authToken;
    }else{
        return nil;
    }
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
    [cell.roomLabel setText:roomModel.name];
    
    return cell;
}

- (void) collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    NSMutableArray *roomModelArray = [roomSections objectAtIndex:indexPath.section];
    RoomModel *roomModel = [roomModelArray objectAtIndex:indexPath.row];
    
    [self createNewRoomController:roomModel];
}

- (void) createNewRoomController:(RoomModel *)roomModel {
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    
    if(![roomManager isRoomOpen:roomModel.roomId]) {
        [SocketFactory createSocket:appDelegate.webAppURI
            onSuccess:^(SIOSocket *socket) {
                [self joinSocket:socket forRoom:roomModel];
            }
            orFail:^() {
                NSLog(@"Could not create socket for room");
            }
        ];
    } else {
        NSLog(@"Room with id %@ is already open", roomModel.roomId);
    }
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
    NSLog(@"Join failed");
}

- (void) handleSuccessfulJoin:(SIOSocket *)socket forRoom:(RoomModel *)roomModel {
    NSMutableArray *currentTabs = [NSMutableArray arrayWithArray:self.tabBarController.viewControllers];
    RoomViewController *newViewController = [RoomViewController createRoomViewController:roomModel withSocket:socket];
    
    [roomModel setSocket:socket];
    [roomManager addRoom:roomModel];
    [newViewController setSocket:socket];
    
    [currentTabs addObject:newViewController];
    [self.tabBarController setViewControllers:currentTabs animated:YES];
    self.tabBarController.selectedViewController = newViewController;
}

#pragma mark Collection view layout settings
- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout insetForSectionAtIndex:(NSInteger)section {
    return UIEdgeInsetsMake(5.0f, 5.0f, 5.0f, 5.0f);
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section {
    return 0.0f;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section {
    return 0.0f;
}

#pragma mark - Toolbar Button Actions
- (void) refreshRoomsButtonClick:(id)sender {
    [self showSpinner];
    [self refreshRooms];
}

@end
