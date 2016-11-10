$(function () {

    'use strict';

    var dEmptyHtml = "snippets/basket-empty-snippet.html",
        dHtml = "snippets/basket-snippet.html",
        dFooterHtml = "snippets/basket-footer-snippet.html";

    function BasketHtml() {}

    var restaurantAPI = new RestaurantAPI();

    BasketHtml.prototype.getBasketEmptyHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                dEmptyHtml,
                function (basketEmptyHtml) {
                    resolve(basketEmptyHtml);
                });
        });
    };

    BasketHtml.prototype.getBasketHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                dHtml,
                function (basketHtml) {
                    resolve(basketHtml);
                });
        });
    };

    BasketHtml.prototype.getBasketFooterHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                dFooterHtml,
                function (basketFooterHtml) {
                    resolve(basketFooterHtml);
                });
        });
    };

    BasketHtml.prototype.getDiscount = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                '/discount',
                function (discount) {
                    resolve(discount);
                });
        });
    };

    BasketHtml.prototype.sendOrder = function (data) {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendPostRequest(
                data,
                '/order',
                function (status) {
                    resolve(status);
                });
        });
    };

    window.BasketHtml = BasketHtml;

});
