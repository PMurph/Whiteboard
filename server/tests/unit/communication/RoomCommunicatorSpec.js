"use strict";
var RoomCommunicator = require('../../../src/communication/RoomCommunicator.js');
var DrawCommandMessage = require('../../../src/communication/objects/DrawCommandMessage.js');

describe("RoomCommunicator", function() {
    var TEST_ROOM_ID = "42";

    var roomManagerStub;
    var testRoomCommunicator;
    var socketManagerStub;
    var socketMock;
    
    var drawCommandLogicMock;

    beforeEach(function() {
        roomManagerStub = {};
        socketManagerStub = {};
        socketMock = jasmine.createSpyObj('Socket', ['join', 'on', 'emit']);
        drawCommandLogicMock = jasmine.createSpyObj('DrawCommandLogic', ['handleDrawCommand', 'handleGetAllDrawCommands']);

        testRoomCommunicator = new RoomCommunicator(roomManagerStub, socketManagerStub, socketMock, drawCommandLogicMock);
    });
        
    it("should call the sockets on method with drawCommand", function() {
        expect(socketMock.on).toHaveBeenCalledWith("drawCommand", jasmine.any(Function));
    });

    it("should call the sockets on method with getAllDrawCommands", function() {
        expect(socketMock.on).toHaveBeenCalledWith("getAllDrawCommands", jasmine.any(Function));
    });

    it("should initialize room id to NULL ", function() {
        expect(testRoomCommunicator.getRoomId()).toEqual(null);
    });

    it("should get/set room id ", function() {
        testRoomCommunicator.setRoomId(TEST_ROOM_ID);
        expect(testRoomCommunicator.getRoomId()).toEqual(TEST_ROOM_ID);
    });

    describe("handle draw commands", function() {
        var TEST_VALID_DRAW_MSG = {msgType: "draw", drawCommand: {some: "test", fields: "k"}};

        beforeEach(function() {
            testRoomCommunicator.handleDrawCommand(TEST_VALID_DRAW_MSG);
        });

        it("should pass a message of the DrawCommandMessage to the draw command logic", function() {
            expect(drawCommandLogicMock.handleDrawCommand).toHaveBeenCalledWith(jasmine.any(DrawCommandMessage));
        });
    });

    describe("sending messages to clients ", function(){
        var TEST_MESSAGE_TYPE = "test type";
        var TEST_MESSAGE = {test: "data"};

        describe("sending messages to a room", function() {
            var socketListMock;
            var socketRoomListMock;

            beforeEach(function() {
                socketListMock = jasmine.createSpyObj('SocketList', ['in', 'emit']);
                socketRoomListMock = jasmine.createSpyObj('SocketManager', ['emit']);
                socketManagerStub.sockets = socketListMock;
                socketListMock.in.and.returnValue(socketRoomListMock);

                testRoomCommunicator.setRoomId(TEST_ROOM_ID);

                testRoomCommunicator.sendMessage(TEST_MESSAGE_TYPE, TEST_MESSAGE);
            });

            it("should broadcast the message to the all the sockets connected to this room", function() {
                expect(socketListMock.in).toHaveBeenCalledWith(TEST_ROOM_ID);
            });

            it("should call the emit function with the message on the list of sockets associated with the room", function() {
                expect(socketRoomListMock.emit).toHaveBeenCalledWith(TEST_MESSAGE_TYPE, TEST_MESSAGE);
            });
        });

        describe("sending message to room", function() {
            beforeEach(function() {
                testRoomCommunicator.sendMessageToSocket(TEST_MESSAGE_TYPE, TEST_MESSAGE, socketMock);
            });

            it("should call the sockets emit message with the message type and data", function() {
                expect(socketMock.emit).toHaveBeenCalledWith(TEST_MESSAGE_TYPE, TEST_MESSAGE);
            });
        });
    });

    describe("getting all draw commands", function() {
        beforeEach(function() {
            testRoomCommunicator.handleGetAllDrawCommands();
        });

        it("should call the drawCommandLogic's handleGetAllDrawCommands function", function() {
            expect(drawCommandLogicMock.handleGetAllDrawCommands).toHaveBeenCalled();
        });
    });
});
