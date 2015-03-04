'use strict';

define([
    'models/DrawModel',
    'models/ChatMessage',
    'models/User',
    ], 
    function(
        DrawModel,
        ChatMessage,
        User) {
    var draw;

    describe("Draw Model", function() {
        beforeEach(function() {
            draw = new DrawModel();
            user = new User();
            msg = new ChatMessage();

            user.setDisplayName("Bob");
        });

        it('it should add users to a list', function(){
            expect(draw.getColour()).toBe("Black");
            expect(draw.getTool()).toBe("Draw");
            expect(draw.getThickness()).toBe(1);
            expect(draw.getListOfCoordinates()).toEqual([]);
        });
    });
});