define([
    'models/room',
    'backbone'
], function(
   Room,
   Backbone
) {
    'use strict';

    describe("Meeting Room", function() {
        var room;

        beforeEach(function() {
            room = new Room();
        });

        it('it should return a list of users', function(){
           var userList = room.getListOfUsersActiveInRoom();
           expect(userList instanceof Backbone.Collection).toBe(true);
        });
    });
});
