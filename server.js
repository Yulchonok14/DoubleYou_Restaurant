var express = require('express');
var app = express();
var path = require('path');

// app.use('/', express.static( __dirname + '/public' ));
app.use(express.static(__dirname, + '/js'));
app.use(express.static(__dirname, + '/styles'));
app.use(express.static(__dirname, + '/libs'));
app.use(express.static(__dirname, + '/snippets'));

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
    res.sendFile('index.html');
});

app.listen(80);
