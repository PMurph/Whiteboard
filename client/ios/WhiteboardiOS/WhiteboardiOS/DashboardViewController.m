#import "DashboardViewController.h"

@interface DashboardViewController () {
        NSArray *roomSections;
    }

    - (void)initView;
    - (void)initRoomCollection;
    - (void)refreshRooms:(id)sender;
    - (void)updateRoomList;
    - (void)createNewRoomController:(RoomModel *)roomModel;
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
    self.roomCollection = [[RoomCollection alloc] init:restkitWrapper];
    [self.roomCollection registerObserver:self];
}

- (void) viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self.roomCollection fetchRooms];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

#pragma mark - RoomCollectionObserver

- (void) notifyOfChange {
    [self updateRoomList];
}

- (void)updateRoomList {
    NSArray *roomModels = [self.roomCollection roomModels];
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
    RoomModel *roomModel = [roomModelArray objectAtIndex:indexPath.row];
    
    cell.backgroundColor = [UIColor whiteColor];
    [cell.roomLabel setText:[roomModel roomId]];
    
    return cell;
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    NSMutableArray *roomModelArray = [roomSections objectAtIndex:indexPath.section];
    RoomModel *roomModel = [roomModelArray objectAtIndex:indexPath.row];
    
    [self createNewRoomController:roomModel];
}

- (void)createNewRoomController:(RoomModel *)roomModel {
    NSMutableArray *currentTabs = [NSMutableArray arrayWithArray:self.tabBarController.viewControllers];
    RoomViewController *newViewController = [RoomViewController createRoomViewController:roomModel];
    
    [currentTabs addObject:newViewController];
    [self.tabBarController setViewControllers:currentTabs animated:YES];
}

#pragma mark - Toolbar Button Actions
- (void)refreshRooms:(id)sender {
    [self.roomCollection fetchRooms];
}

@end
