$(function () {

    'use strict';

    var hEmptyHtml = "snippets/history-empty-snippet.html",
        hSearchHtml = "snippets/history-search-snippet.html",
        hHeaderHtml = "snippets/history-snippet-header.html",
        hFooterHtml = "snippets/history-snippet-footer.html",
        hHtml = "snippets/history-snippet.html";

    function HistoryHtml() {}

    var restaurantAPI = new RestaurantAPI();

    HistoryHtml.prototype.getHistoryEmptyHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                hEmptyHtml,
                function (historyEmptyHtml) {
                    resolve(historyEmptyHtml);
                });
        });
    };

    HistoryHtml.prototype.getHistorySearchHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                hSearchHtml,
                function (historySearchHtml) {
                    resolve(historySearchHtml);
                });
        });
    };

    HistoryHtml.prototype.getHistoryHeaderHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                hHeaderHtml,
                function (historyHeaderHtml) {
                    resolve(historyHeaderHtml);
                });
        });
    };

    HistoryHtml.prototype.getHistoryFooterHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                hFooterHtml,
                function (historyFooterHtml) {
                    resolve(historyFooterHtml);
                });
        });
    };

    HistoryHtml.prototype.getHistoryHTML = function () {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendGetRequest(
                hHtml,
                function (historyHtml) {
                    resolve(historyHtml);
                });
        });
    };

    HistoryHtml.prototype.sendEmail = function (data) {
        return new Promise(function (resolve, reject) {
            restaurantAPI.sendPostRequest(
                data,
                '/history',
                function (status) {
                    resolve(status);
                });
        });
    };

    window.HistoryHtml = HistoryHtml;

});
