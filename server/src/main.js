var Server = require("./server"),
    express = require('express'),
    socketIO = require('socket.io'),
    mongoose = require('mongoose');

var serv = new Server(express(), socketIO);

serv.start();
