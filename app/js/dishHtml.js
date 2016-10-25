$(function () {

    'use strict';

    var dTitleHtml = "snippets/dish-title-snippet.html";
    var dHtml = "snippets/dish-snippet.html";
    var dEmptyHtml = "snippets/dish-empty-snippet.html";

    function DishHtml() {}

    var restaurantAPI = new RestaurantAPI();

    DishHtml.prototype.getDishHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                dHtml,
                function (dishHtml) {
                    resolve(dishHtml);
                });
        });
    };

    DishHtml.prototype.getDishTitleHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                dTitleHtml,
                function (dishTitleHtml) {
                    resolve(dishTitleHtml);
                });
        });
    };

    DishHtml.prototype.getDishEmptyHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                dEmptyHtml,
                function (dishEmptyHtml) {
                    resolve(dishEmptyHtml);
                });
        });
    };

    window.DishHtml = DishHtml;

});
