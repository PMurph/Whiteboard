'use strict';

define(['models/DrawModel'], function(DrawModel) {
    var draw;

    describe("Draw Model", function() {
        beforeEach(function() {
            draw = new DrawModel();
        });

        it('it should return good default values', function(){
            expect(draw.getColour()).toBe("Black");
            expect(draw.getTool()).toBe("Draw");
            expect(draw.getThickness()).toBe(1);
            expect(draw.getListOfCoordinates()).toBe([]);
        });

        it('it should return false on setting bad values', function(){
            expect(draw.setColour("asdfasfd")).toBe(false);
            expect(draw.getColour()).toBe("Black");
            expect(draw.setTool("asdfasfd")).toBe(false);
            expect(draw.getTool()).toBe("Draw");
            expect(draw.setThickness(999)).toBe(false);
        });

        it('it should return true on setting good values', function(){
            expect(draw.setColour("Red")).toBe(true);
            expect(draw.getColour()).toBe("Red");
            expect(draw.setColour("Blue")).toBe(true);
            expect(draw.getColour()).toBe("Blue");
            expect(draw.setTool("Draw")).toBe(true);
            expect(draw.getTool()).toBe("Draw");
            expect(draw.setTool("Erase")).toBe(true);
            expect(draw.getTool()).toBe("Erase");
            expect(draw.setThickness(2)).toBe(false);
        });

        it('it should set good coordinates and print them out in order', function(){
            draw.addCoordinate(0, 0);
            expect(draw.getListOfCoordinates()[0].getXY()).toBe([0,0]);
            draw.addCoordinate(1, 1);
            expect(draw.getListOfCoordinates()[0].getXY()).toBe([0,0]);
            expect(draw.getListOfCoordinates()[1].getXY()).toBe([1,1]);
        });
    });
});