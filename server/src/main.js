var Server = require("./server"),
    express = require('express');

var serv = new Server(express());
serv.start();
