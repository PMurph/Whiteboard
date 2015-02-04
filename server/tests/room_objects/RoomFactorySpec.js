"use strict";
var RoomFactory = require("../../src/room_objects/RoomFactory.js");

describe("RoomFactory", function() {
    var roomFactory;
    var CREATING_USER = {userId: "2", username: "testuser"};
    var ROOM_ID = 1;

    describe("Room Id", function() {
        beforeEach(function() {
            roomFactory = new RoomFactory(CREATING_USER);
        });

        it('should return a new room id every time', function(){
            expect(roomFactory.getNextRoomID()).toBe(ROOM_ID);
            expect(roomFactory.getNextRoomID()).toBe(ROOM_ID + 1);
        });
    });
});
