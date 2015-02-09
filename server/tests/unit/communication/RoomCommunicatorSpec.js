"use strict";
var RoomCommunicator = require('../../../src/communication/RoomCommunicator.js');

describe("RoomCommunicator", function() {
    var TEST_ROOM_ID = 42;

    var testRoomCommunicator;
    var socketManagerStub;
    
    var drawCommandLogicMock;
    var messageFactoryMock;

    beforeEach(function() {
        socketManagerStub = {};
        drawCommandLogicMock = jasmine.createSpyObj('DrawCommandLogic', ['handleDrawCommand']);
        messageFactoryMock = jasmine.createSpyObj('MessageFactory', ['wrapIncomingMessage']);

        testRoomCommunicator = new RoomCommunicator(socketManagerStub, TEST_ROOM_ID, drawCommandLogicMock, messageFactoryMock);
    });

    describe("handle draw commands", function() {
        var TEST_WRAPPED_DRAW_COMMAND_MSG = {test: "message"};
        var TEST_VALID_DRAW_MSG = {msgType: "draw", drawCommand: {some: "test", fields: "k"}};

        beforeEach(function() {
            messageFactoryMock.wrapIncomingMessage.and.returnValue(TEST_WRAPPED_DRAW_COMMAND_MSG);
            testRoomCommunicator.handleDrawCommand(TEST_VALID_DRAW_MSG);
        });

        it("should call the message factory to wrap the incoming message is of type 'draw'", function() {
            expect(messageFactoryMock.wrapIncomingMessage).toHaveBeenCalledWith(testRoomCommunicator, TEST_VALID_DRAW_MSG);
        });

        it("should pass a message of the 'draw' type to the draw command logic", function() {
            expect(drawCommandLogicMock.handleDrawCommand).toHaveBeenCalledWith(TEST_WRAPPED_DRAW_COMMAND_MSG);
        });
    });

    describe("sending messages to clients", function(){
        var TEST_MESSAGE_TYPE = "test type";
        var TEST_MESSAGE = {test: "data"};
        
        var socketListMock;
        var socketRoomListMock;

        beforeEach(function() {
            socketListMock = jasmine.createSpyObj('SocketList', ['in']);
            socketRoomListMock = jasmine.createSpyObj('SocketManager', ['emit']);
            socketManagerStub.sockets = socketListMock;
            socketListMock.in.and.returnValue(socketRoomListMock);

            testRoomCommunicator.sendMessage(TEST_MESSAGE_TYPE, TEST_MESSAGE);
        });

        it("should broadcast the message to the all the sockets connected to this room", function() {
            expect(socketListMock.in).toHaveBeenCalledWith(TEST_ROOM_ID);
        });

        it("should call the emit function with the message on the list of sockets associated with the room", function() {
            expect(socketRoomListMock.emit).toHaveBeenCalledWith(TEST_MESSAGE_TYPE, TEST_MESSAGE);
        }); 
    });
    
    describe("adding a new clients to communicator", function() {
        var socketMock;
        
        beforeEach(function() {
            socketMock = jasmine.createSpyObj('Socket', ['join', 'on']);
            
            testRoomCommunicator.addSocket(socketMock);
        });
        
        it("should call the sockets join method with the room id", function() {
            expect(socketMock.join).toHaveBeenCalledWith(TEST_ROOM_ID);
        });
        
        it("should call the sockets on method with drawCommand", function() {
            expect(socketMock.on).toHaveBeenCalledWith("drawCommand", jasmine.any(Function));
        });
    });
});