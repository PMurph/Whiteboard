var Server = require("./server"),
    express = require('express'),
    socketIO = require('socket.io');

var serv = new Server(express(), socketIO);

serv.start();
