#ifndef WhiteboardiOS_RoomCell_h
#define WhiteboardiOS_RoomCell_h

#import <UIKit/UIKit.h>

#import "RoomModel.h"

@interface RoomCell : UICollectionViewCell

    @property (weak, atomic) IBOutlet UILabel *roomLabel;

@end


#endif
