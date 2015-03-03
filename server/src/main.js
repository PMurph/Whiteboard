var Server = require("./server"),
    express = require('express'),
    socketIO = require('socket.io'),
    mongoose = require('mongoose'),
    UserManager = require('./session/UserManager'),
    UserSession = require('./session/UserSession'),
    UserRequest = require('./session/UserRequest');

var userManager = new UserManager(mongoose),
    userSession = new UserSession(userManager),
    userRequest = new UserRequest(userManager, userSession),
    serv = new Server(express(), userRequest, socketIO);

serv.start();
