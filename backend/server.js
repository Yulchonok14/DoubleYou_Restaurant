'use strict';
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    server = app.listen(80),
    io = require('socket.io')(server),
    fs = require('fs'),
    filePathHistory = path.join(__dirname, '/history.json'),
    filePathOrder = path.join(__dirname, '/orders.json'),
    sk = require('./socket.js');

app.use(express.static(path.join(__dirname, '..', 'app')));
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

var addToHistory = function(order, status){
    fs.readFile(filePathHistory, 'binary', function (err, data) {
        if (err) {
            return console.error(err);
        }
        var dataArr = JSON.parse(data),
            historyObj = {};
        historyObj.dishes = order.dishes;
        historyObj.date = order.date;
        historyObj.status = status;
        historyObj.email = order.email;
        historyObj.price = order.price;
        historyObj.discount = order.discount;
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
            fs.readFile(filePathOrder, 'binary', function (err, data) {
                if (err) {
                    return console.error(err);
                }
                var orderArr = JSON.parse(data);
                for (var i = 0, len = orderArr.length; i < len; i++) {
                    if (orderArr[i].email === email) {
                        sendArr.unshift(orderArr[i]);
                    }
                }
                res.send(JSON.stringify(sendArr));
            });
        });
    })
};

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '..', 'app/index.html'));
});

app.get('/discount', requestDiscount, function(req, res){
    res.send(req.requestDiscount + '');
});

app.get('/menu', function(req, res){
    res.sendFile(path.join(__dirname, '/menu.json'));
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

sk.onSocket(io);

