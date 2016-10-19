var express = require('express');
var app = express();
var path = require('path');

// app.use('/', express.static( __dirname + '/public' ));
app.use(express.static(__dirname, + '/js'));
app.use(express.static(__dirname, + '/styles'));
app.use(express.static(__dirname, + '/libs'));
app.use(express.static(__dirname, + '/snippets'));

app.use(express.static(__dirname + '/public'));

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


app.get('/',function(req,res){
    res.sendFile('index.html');
});

app.get('/discount',function(req,res){
    res.send(req.requestDiscount + '');
});

app.listen(80);
