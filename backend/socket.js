module.exports = {

    onSocket: function (io) {
        io.on('connection', function(socket) {
            console.log('a user connected');
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });

            var id = Math.random();
            console.log("новое соединение " + id);

            socket.on('message', function(message) {
                console.log('получено сообщение ' + message);
                parseMessage(message)
                    .then (function (res) {
                        console.log(res);
                        clientArr.push({
                            socket: socket,
                            email: res
                        });
                    });
                socket.send('Received');
            });

            socket.on('close', function() {
                console.log('соединение закрыто ' + id);
            });

        })
    }
};

var wSF = require('./webSocketFunctions.js'),
    clientArr = [];

var parseMessage = function (message) {
    return new Promise(function (resolve, reject) {
        try {
            var reply = JSON.parse(message);
        } catch (err) {
            reject({
                code: -32700,
                message: 'cannot parse object to JSON',
                data: message
            });
        }
        try {
            var method = reply.method;
            var params = JSON.parse(reply.params);
        } catch (err) {
            reject({
                code: -32600,
                message: 'object is not in right format',
                data: message
            });
        }
        wSF.execMethod(method, params)
            .then(function (res) {
                resolve(res);
            }).catch(function (err) {
                console.log(err);
            })
    });
};