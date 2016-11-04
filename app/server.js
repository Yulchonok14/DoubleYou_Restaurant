'use strict';
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    server = app.listen(80),
    io = require('socket.io')(server),
    fs = require('fs'),
    filePathOrder = __dirname + '/orders.json',
    filePathHistory = __dirname + '/history.json';

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


global.processNewOrder = function processNewOrder(order){
    fs.readFile(filePathOrder, 'binary', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var dataArr = JSON.parse(data),
            orderObj = JSON.parse(order),
            dishesArr;
        for(var i = 0, len = dataArr.length; i < len; i++){
            if(dataArr[i].email === orderObj.email) {
                dishesArr = dataArr[i].dishes;
                for(var j = 0, leng = orderObj.dishes.length; j < leng; j++) {
                    dishesArr.push(orderObj.dishes[j]);
                }
                break;
            } else {
                dataArr.push(orderObj);
                addToHistory(orderObj, 'Delivered');
            }
        }
        if(dataArr.length === 0){
            dataArr.push(orderObj);
            addToHistory(orderObj, 'Delivered');
        }

        fs.writeFile(filePathOrder, JSON.stringify(dataArr), function(err) {
            if (err) {
                return console.error(err);
            }
        });
    });
};

var addToHistory = function(order, status){
    fs.readFile(filePathHistory, 'binary', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var dataArr = JSON.parse(data),
            dishesArr,
            historyObj = {},
            date = new Date();
        historyObj.dishes = order.dishes;
        historyObj.date = date.toDateString();
        historyObj.status = status;
        historyObj.email = order.email;
        historyObj.price = order.totalPrice;
        dataArr.push(historyObj);
        fs.writeFile(filePathHistory, JSON.stringify(dataArr), function(err) {
            if (err) {
                return console.error(err);
            }
        });
    });
};

var getAllHistory = function (res, email) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePathHistory, 'binary', function (err, data) {
            if (err) {
                return console.error(err);
            }
            var dataArr = JSON.parse(data),
                sendArr = [];
            for (var i = 0, len = dataArr.length; i < len; i++) {
                if (dataArr[i].email === email) {
                    sendArr.push(dataArr[i]);
                }
            }
            res.send(JSON.stringify(sendArr))
        });
    })
};

var parseMessage = function (message) {
    var reply = JSON.parse(message);
    var method = reply.method;
    var params = JSON.parse(reply.params);
    global[method](reply.params);
};

app.get('/', function(req, res){
    res.sendFile('index.html');
});

app.get('/discount', requestDiscount, function(req, res){
    res.send(req.requestDiscount + '');
});

app.post('/history', function(req, res){
    var bodyStr = '';
    req.on('data',function(chunk){
        bodyStr += chunk.toString();
    });
    req.on('end',function(){
        getAllHistory(res, bodyStr).then(
            res.send.bind(res)
        );
    });
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

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    var id = Math.random();
    console.log("новое соединение " + id);

    socket.on('message', function(message) {
        console.log('получено сообщение ' + message);
        parseMessage(message);
        socket.send('Received');
    });

    socket.on('close', function() {
        console.log('соединение закрыто ' + id);
    });

});

