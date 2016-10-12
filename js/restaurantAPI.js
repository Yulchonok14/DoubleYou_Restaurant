$(function () {
    'use strict';

    function RestaurantAPI(){}

    RestaurantAPI.prototype.sendGetRequest = function(requestUrl, responseHandler) {
        var request = new XMLHttpRequest();
        request.open("GET", requestUrl, true);
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

    window.RestaurantAPI = RestaurantAPI;
});