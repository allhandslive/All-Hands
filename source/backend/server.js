/*global require, __dirname, console*/
var express = require('express'),
    net = require('net'),
    N = require('./nuve'),
    fs = require("fs"),
    https = require("https");

var options = {
    key: fs.readFileSync('cert/allhands.key').toString(),
    cert: fs.readFileSync('cert/allhands.crt').toString()
};

var app = express();

app.use(express.bodyParser());

app.configure(function () {
    "use strict";
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.logger());
    app.use(express.static(__dirname + '/../frontend'));
    //app.set('views', __dirname + '/../views/');
    //disable layout
    //app.set("view options", {layout: false});
});

app.use(function (req, res, next) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

N.API.init('52e85c3ca0fedbd195558058', '9397', 'http://localhost:3000/');

var myRoom;

N.API.getRooms(function (roomlist) {
    "use strict";
    var rooms = JSON.parse(roomlist);
    console.log(rooms.length);
    if (rooms.length === 0) {
        N.API.createRoom('myRoom', function (roomID) {
            myRoom = roomID._id;
            console.log('Created room ', myRoom);
        });
    } else {
        myRoom = rooms[0]._id;
        console.log('Using room ', myRoom);
    }
});

app.get('/Token/:username/:role', function (req, res) {
    "use strict";
    var room = myRoom,
        username = req.params.username,
        role = req.params.role;
    N.API.createToken(room, username, role, function (token) {
        console.log(token);
        res.send(token);
    });
});

app.get('/Rooms', function (req, res) {
    "use strict";
    N.API.getRooms(function (rooms) {
        res.send(rooms);
    });
});

app.get('/Rooms/:room/Users', function (req, res) {
    "use strict";
    var room = req.params.room;
    N.API.getUsers(room, function (users) {
        res.send(users);
    });
});

var server = https.createServer(options, app);
server.listen(443);