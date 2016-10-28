$(function () {
    'use strict';

    function RestaurantAPI(){}

    var socket = io('http://localhost:80/');

    RestaurantAPI.prototype.sendGetRequest = function(requestUrl, responseHandler) {
        var request = new XMLHttpRequest();
        request.open('GET', requestUrl, true);
        request.addEventListener('load', function () {
            if (typeof responseHandler === 'function') {
                responseHandler(request.response);
            }
        });
        request.addEventListener('error', function (e) {
            console.log(e);
        });

        request.send();
    };

    RestaurantAPI.prototype.sendPostRequest = function(data, requestUrl, responseHandler) {
        var request = new XMLHttpRequest();
        request.open('POST', requestUrl, true);
        request.addEventListener('load', function () {
            if (typeof responseHandler === 'function') {
                responseHandler(request.response);
            }
        });
        request.addEventListener('error', function (e) {
            console.log(e);
        });

        request.send(data);
    };

    RestaurantAPI.prototype.sendSocketRequest = function(data, responseHandler) {
        socket.send(data);
        socket.on('message', function(message) {
            var status = message;
            if (typeof responseHandler === 'function') {
                responseHandler(status);
            }
        });
       /* socket.emit('close');
        socket.close();*/
    };

    window.RestaurantAPI = RestaurantAPI;
});