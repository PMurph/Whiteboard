#ifndef WhiteboardiOS_RoomModel_h
#define WhiteboardiOS_RoomModel_h

#import <SIOSocket/SIOSocket.h>

@interface RoomModel : NSObject

    @property (nonatomic, copy) NSString *roomId;
    @property (nonatomic, copy) NSString *name;
    @property (nonatomic, copy) NSString *type;

    @property (nonatomic, readwrite) SIOSocket *socket;

    - (id) init:(NSString *)assignedRoomId;
   
@end


#endif
