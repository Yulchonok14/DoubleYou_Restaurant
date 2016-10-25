'use strict';
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    server = app.listen(80),
    io = require('socket.io')(server);

// var jayson = require(__dirname + '/js/jayson.js');
//
// // create a server
// jayson.server({
//     getEmail: function(args, callback) {
//         callback(null, args);
//     }
// });

// server.http().listen(80);
app.use(express.static(__dirname, + '/js'));
app.use(express.static(__dirname, + '/styles'));
app.use(express.static(__dirname, + '/libs'));
app.use(express.static(__dirname, + '/snippets'));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var requestDiscount = function (req, res, next) {
    var day = new Date().getDate();
    if(day % 5 === 0) {
        req.requestDiscount = 5;
    } else if(day % 2 === 0) {
        req.requestDiscount = 2;
    } else {
        req.requestDiscount = 1;
    }
    next();
};

app.use(requestDiscount);

app.get('/', function(req, res){
    res.sendFile('index.html');
});

app.get('/discount', function(req, res){
    res.send(req.requestDiscount + '');
});

app.post('/order', function(req, res){
    var bodyStr = '';
    req.on('data',function(chunk){
        bodyStr += chunk.toString();
    });
    req.on('end',function(){
        res.send(JSON.parse(bodyStr));
    });
});

// подключенные клиенты
var clients = {};

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    var id = Math.random();
    clients[id] = socket;
    console.log("новое соединение " + id);

    socket.on('message', function(message) {
        console.log('получено сообщение ' + message);

        for (var key in clients) {
            clients[key].send(message);
        }
    });

    socket.on('close', function() {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });

});

